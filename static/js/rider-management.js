$(document).ready(() => {
  existingRiderFlagNumberFound = false;
  existingPassengerFlagNumberFound = false;
  hasPassenger = false;
  var activeRidersTable = $('#activeRidersTable').DataTable({
    ajax: {
      url: '/api/v1/riders',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'FlagNumber' },
      { data: 'FirstName' },
      { data: 'LastName' },
      { data: 'Email' },
      { data: 'CellNumber' },
      { data: null, name: 'Actions' },
    ],
    columnDefs: [
      { targets: [0], visible: false },
      {
        render: function (data, type, row) {
          return `<div class="resetFlagSelection" data-uid="${row['id']}"><span class="toh-mr-8"><i class="fa-duotone fa-flag"></i></span>${data}</div>`
        }, targets: [1]
      },
      {
        render: function (data, type, row) {
          if (data) {
            return `<div class="sendSMSTextButton" data-uid="${row['id']}">${data} <i class="fa-light fa-message-sms fa-lg"></i></div>`
          } else {
            return data
          }
        }, targets: [5]
      },
      {
        render: function (data, type, row) {
          return `<div class="editUserButton" data-uid="${row['id']}"><i class="fa-light fa-pen-to-square fa-lg"></i> Edit Rider</div>`
        }, targets: [6]
      }
    ],
    language: {
      entries: {
        _: 'riders',
        1: 'rider',
      },
    },
    layout: {
      topStart: {
        buttons: [
          {
            extend: 'excel',
            text: 'Save to Excel',
            title: 'TOH Active Riders',
            sheetName: 'Active Riders',
            exportOptions: {
              modifier: {
                search: 'none',
                page: 'all',
              },
            },
          },
        ],
      },
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging',
    },
    pageLength: 100,
  });

  var inactiveRidersTable = $('#inactiveRidersTable').DataTable({
    ajax: {
      url: '/api/v1/riders/inactive',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'FlagNumber' },
      { data: 'FirstName' },
      { data: 'LastName' },
      { data: 'Email' },
      { data: 'CellNumber' },
      { data: null, name: 'Actions' },
    ],
    columnDefs: [
      { targets: [0], visible: false },
      {
        render: function (data, type, row) {
          return '<div class="resetFlagSelection" data-uid="' + row['id'] + '"><span class="toh-mr-8"><i class="fa-duotone fa-flag"></i></span>' + data + '</div>'
        }, targets: [1]
      },
      {
        render: function (data, type, row) {
          if (data) {
            return '<div class="sendSMSTextButton" data-uid="' + row['id'] + '">' + data + ' <i class="fa-light fa-message-sms fa-lg"></i></div>'
          } else {
            return data
          }
        }, targets: [5]
      },
      {
        render: function (data, type, row) {
          return '<div class="editUserButton" data-uid="' + row['id'] + '"><i class="fa-light fa-pen-to-square fa-lg"></i> Edit Rider</div>'
        }, targets: [6]
      }
    ],
    language: {
      entries: {
        _: 'riders',
        1: 'rider',
      },
    },
    layout: {
      topStart: {
        buttons: [
          {
            extend: 'excel',
            text: 'Save to Excel',
            title: 'TOH Inactive Riders',
            sheetName: 'Inactive Riders',
            exportOptions: {
              modifier: {
                search: 'none',
                page: 'all',
              },
            },
          },
        ],
      },
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging',
    },
    pageLength: 100,
  });

  var passRiderPairingsTable = $('#passRiderPairingsTable').DataTable({
    ajax: {
      url: '/api/v1/riders/pairings',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'RiderFlagNumber' },
      { data: 'PassengerFlagNumber' },
      { data: 'RallyYear' },
      { data: null, name: 'Actions' },
    ],
    columnDefs: [
      { targets: [0], visible: false },
      {
        render: function (data, type, row) {
          return `${data} (${row['RiderName']})`
        }, targets: [1]
      },
      {
        render: function (data, type, row) {
          return `${data} (${row['PassengerName']})`
        }, targets: [2]
      },
      {
        render: function (data, type, row) {
          return `<div class="deletePairingBtn" data-pid="${row['id']}"><i class="fa-light fa-trash-can fa-lg"></i> Delete Pairing</div>`
        }, targets: [4]
      },
    ],
    language: {
      entries: {
        _: 'pairings',
        1: 'pairing',
      },
    },
    layout: {
      topStart: {
        buttons: [
          {
            extend: 'excel',
            text: 'Save to Excel',
            title: 'TOH Riders / Passenger Pairings',
            sheetName: 'Pairings',
            exportOptions: {
              modifier: {
                search: 'none',
                page: 'all',
              },
            },
          },
        ],
      },
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging',
    },
    pageLength: 100,
  });

  // Force tables to be full width
  $('table#activeRidersTable').css('width', '100%');
  $('table#inactiveRidersTable').css('width', '100%');
  $('table#passRiderPairingsTable').css('width', '100%');

  $('#sponsorsTable').DataTable();

  $('#hasPassenger').change(function () {
    if (this.checked) {
      $('.PassengerInfoDiv').removeClass('hide-me');
      $('#PassengerFirstName').prop('required', true);
      $('#PassengerLastName').prop('required', true);
      $('#PassengerFlagNum').prop('required', true);
      $('#PassengerShirtStyle').prop('required', true);
      $('#PassengerShirtSize').prop('required', true);
      hasPassenger = true;
    } else {
      $('.PassengerInfoDiv').addClass('hide-me');
      $('#PassengerFirstName').prop('required', false);
      $('#PassengerLastName').prop('required', false);
      $('#PassengerFlagNum').prop('required', false);
      $('#PassengerShirtStyle').prop('required', false);
      $('#PassengerShirtSize').prop('required', false);
      hasPassenger = false;
    }
  });

  // Handle Edit Rider Button
  $('#activeRidersTable, #inactiveRidersTable').on('click', '.editUserButton', function () {
    const uid = $(this).data('uid');
    $('#userDetailEditModal').css('display', 'block');
    $.ajax(`/api/v1/riderInfo/${uid}`, {
      type: 'GET',
    }).then((res) => {
      $('#EditUserID').val(res.id);
      $('#editUserHeading').text(`Edit ${res.FirstName} ${res.LastName} (${res.FlagNumber})`)
      if (res.FlagNumber > 0) {
        $('#EditFlagNumber').val(res.FlagNumber);
      }
      $('#EditFirstName').val(res.FirstName);
      $('#EditLastName').val(res.LastName);
      $('#EditEmail').val(res.Email);
      $('#EditCellNumber').val(res.CellNumber);
      $('#EditAddress').val(res.Address1);
      $('#EditCity').val(res.City);
      $('#EditState').val(res.State);
      $('#EditZipCode').val(res.ZipCode);
      if (res.isAdmin) {
        $('#isAdmin').prop('checked', true);
      } else {
        $('#isAdmin').prop('checked', false);
      }
    });
  });

  // Handle Reset Flag Selection Button (on Data Table)
  $('#activeRidersTable').on('click', '.resetFlagSelection', function () {
    const uid = $(this).data('uid');
    $.ajax(`/api/v1/riderInfo/${uid}`, {
      type: 'GET',
    }).then((res) => {
      $('#resetRiderFlagBtn').attr('data-userid', uid).attr('data-flagnumber', res.FlagNumber).attr('data-role', res.OrderRole).attr('data-oid', res.OrderID);
      $('#riderFlagNumber').text(res.FlagNumber);
      $('#riderCellNumber').text(res.CellNumber);
      $('#resetFlagNumberModal').css('display', 'block');
    });
  });

  // Handle Reset Flag Number Button (on Warning Modal)
  $("#resetRiderFlagBtn").on('click', function () {
    const FlagNumber = $(this).data('flagnumber');
    const uid = $(this).data('uid');
    const Role = $(this).data('role');
    const OrderID = $(this).data('oid');
    const ResetInfo = {
      FlagNumber,
      UserID: uid,
      Role,
      OrderID
    }
    $('#resetFlagNumberModal').css('display', 'none');

    $.ajax('/api/v1/orders/reset', {
      beforeSend() {
        $('.modal').css('display', 'none');
        $('.spinnerBox').removeClass('hide-me');
      },
      complete() {
        $('.spinnerBox').addClass('hide-me');
      },
      type: 'POST',
      data: ResetInfo
    })
      .then(() => {
        activeRidersTable.ajax.reload();
      })
      .catch(() => {
        showToastrError(`An error occured while resetting flag ${FlagNumber}.`);
      });
  })

  // Lookup Rider Flag Number Info
  $('#RiderFlagNumber').on('input paste', function () {
    $('#riderFlagNumberAssignedTo').addClass('hide-me');
    const riderFlagNumber = $(this).val();
    if (riderFlagNumber) {
      $.ajax(`/api/v1/riders/flag/${riderFlagNumber}`, {
        type: 'GET',
      }).then((riderInfo) => {
        if (riderInfo.length > 0) {
          $('#riderFlagNumberAssignedTo')
            .text(`${riderInfo[0].FullName}`)
            .css('color', 'green')
            .removeClass('hide-me');
          riderFlagValid = true;
          if (riderFlagNumber != $('#PassengerFlagNumber').val().trim()) {
            enableSavePairingBtn();
          }
        } else {
          $('#riderFlagNumberAssignedTo')
            .text('No Flag Found!')
            .css('color', 'red')
            .removeClass('hide-me');
          riderFlagValid = false;
          enableSavePairingBtn();
        }
      });
    }
  });

  // Lookup Passenger Flag Number Info
  $('#PassengerFlagNumber').on('input paste', function () {
    $('#passengerFlagNumberAssignedTo').addClass('hide-me');
    const passengerFlagNumber = $(this).val();
    if (passengerFlagNumber) {
      $.ajax(`/api/v1/riders/flag/${passengerFlagNumber}`, {
        type: 'GET',
      }).then((riderInfo) => {
        if (riderInfo.length > 0) {
          $('#passengerFlagNumberAssignedTo')
            .text(`${riderInfo[0].FullName}`)
            .css('color', 'green')
            .removeClass('hide-me');
          passengerFlagValid = true;
          if (passengerFlagNumber != $('#RiderFlagNumber').val().trim()) {
            enableSavePairingBtn();
          }
        } else {
          $('#passengerFlagNumberAssignedTo')
            .text('No Flag Found!')
            .css('color', 'red')
            .removeClass('hide-me');
          passengerFlagValid = false;
          enableSavePairingBtn();
        }
      });
    }
  });

  // Handle Text Rider Button
  $('#activeRidersTable').on('click', '.sendSMSTextButton', function () {
    const id = $(this).data('uid');
    $('#sendTextMessageModal').css('display', 'block');
    $.ajax(`/api/v1/user/${id}`, {
      type: 'GET',
    }).then((res) => {
      $('#TextUserID').val(res.id);
      $('#TextCellNumber').val(res.CellNumber);
      $('#TextName').text(`${res.FirstName} ${res.LastName}`);
    });
  });

  // Handle Add New Pairing Button
  $('#addNewPairingBtn').on('click', function () {
    $('#addRiderPassengerPairingModal').css('display', 'block');
  })

  // Handle Save New Pairing Button
  $('#saveNewPairingBtn').on('click', () => {
    let RiderFlagNumber = 0;
    let PassengerFlagNumber = 0;

    let isAdmin = false;

    if (parseInt($('#RiderFlagNumber').val(), 10) > 0) {
      RiderFlagNumber = parseInt($('#RiderFlagNumber').val(), 10);
    }
    if (parseInt($('#PassengerFlagNumber').val(), 10) > 0) {
      PassengerFlagNumber = parseInt($('#PassengerFlagNumber').val(), 10);
    }

    const newPairing = {
      RiderFlagNumber,
      PassengerFlagNumber,
    };

    $.ajax('/api/v1/riders/pairings', {
      type: 'POST',
      data: newPairing,
    }).then(() => {
      passRiderPairingsTable.ajax.reload();
    });
  });

  // Handle Delete Pairing Button (on Data Table)
  $('#passRiderPairingsTable').on('click', '.deletePairingBtn', function () {
    const pid = $(this).data('pid');
    $.ajax(`/api/v1/riders/pairings/${pid}`, {
      type: 'DELETE',
    }).then((res) => {
      location.reload();
    });
  });

  // Handle Edit User Dialog Close Button
  $('.close').on('click', () => {
    $('.modal').css('display', 'none');
  });

  // Handle Edit Dialog Cancel Button
  $('.cancelButton').on('click', () => {
    $('.modal').css('display', 'none');
  });

  // Handle Save Changes Button
  $('#saveUserChangesButton').on('click', () => {
    const id = $('#EditUserID').val();
    let FlagNumber = 0;
    let isAdmin = false;

    if (parseInt($('#EditFlagNumber').val(), 10) > 0) {
      FlagNumber = parseInt($('#EditFlagNumber').val(), 10);
    }
    if ($('#isAdmin').prop('checked') == true) {
      isAdmin = true;
    }

    const updateUser = {
      UserID: id,
      FlagNumber,
      FirstName: $('#EditFirstName').val().trim(),
      LastName: $('#EditLastName').val().trim(),
      Email: $('#EditEmail').val().trim(),
      Address1: $('#EditAddress').val().trim(),
      City: $('#EditCity').val().trim(),
      State: $('#EditState').val().trim(),
      ZipCode: $('#EditZipCode').val().trim(),
      CellNumber: $('#EditCellNumber').val().trim(),
      isAdmin,
    };
    $.ajax('/api/v1/user/', {
      type: 'put',
      data: updateUser,
    }).then(() => {
      location.reload();
    });
  });

  // Handle Delete User Button
  $('.deleteUserButton').on('click', function () {
    const id = $(this).data('uid');
    $.ajax(`/api/v1/user/${id}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });

  // Character counter for Text Message box
  $('#textMessageContent').keyup(function () {
    countChar(this);
  });

  // Handle Send Text Message button
  $('#sendTextMessageButton').on('click', () => {
    const UserID = $('#TextUserID').val().trim();
    const cellNumber = $('#TextCellNumber').val().trim();
    const textMessageData = {
      UserID,
      destNumber: cellNumber,
      Message: $('#textMessageContent').val().trim(),
    };
    $.ajax('/api/v1/sendSMS', {
      type: 'POST',
      data: textMessageData,
    }).then(() => {
      $('#sendTextMessageModal').css('display', 'none');
    });
  });

  // Handle Send Profile Email Button
  $('#activeRidersTable').on('click', '.sendProfileEmailButton', function () {
    const id = $(this).data('uid');
    const profileData = {};
    $.ajax(`/api/v1/user/${id}`, {
      type: 'GET',
    }).then((res) => {
      profileData.FlagNumber = res.FlagNumber;
      profileData.UserName = res.UserName;
      profileData.FirstName = res.FirstName;
      profileData.Email = res.Email;
      $.ajax('/api/v1/portalemail', {
        type: 'POST',
        data: profileData,
      }).then(() => {
        location.reload();
      });
    });
  });

  // Check Rider Flag Number Uniqueness
  $('#FlagNumber').on('input paste', function () {
    const id = $(this).val();
    if (id) {
      $.ajax(`/api/v1/flag/${id}`, {
        type: 'GET',
      }).then((flagInfo) => {
        if (flagInfo) {
          existingRiderFlagNumberFound = true;
          $('#FlagNumber').css('border', '4px solid red');
        } else {
          existingRiderFlagNumberFound = false;
          $('#FlagNumber').css('border', 'none');
        }
      });
    }
  });

  // Check Passenger Flag Number Uniqueness
  $('#PassengerFlagNum').on('input paste', function () {
    const id = $(this).val();
    if (id) {
      $.ajax(`/api/v1/flag/${id}`, {
        type: 'GET',
      }).then((flagInfo) => {
        if (flagInfo) {
          existingPassengerFlagNumberFound = true;
          $('#PassengerFlagNum').css('border', '4px solid red');
        } else {
          existingPassengerFlagNumberFound = false;
          $('#PassengerFlagNum').css('border', 'none');
        }
      });
    }
  });

  // Handle Rider Registration
  $('#createUserButton').on('click', () => {
    const randomUserName = randomString(8);
    const randomPassUserName = randomString(8);
    const newUser = {
      FirstName: $('#FirstName').val().trim(),
      LastName: $('#LastName').val().trim(),
      Email: $('#Email').val().trim(),
      UserName: randomUserName,
      Password: randomString(14),
      FlagNumber: $('#FlagNumber').val().trim(),
    };

    const newPassenger = {
      FirstName: $('#PassengerFirstName').val().trim(),
      LastName: $('#PassengerLastName').val().trim(),
      Email: `${randomPassUserName}@placeholder.com`,
      UserName: randomPassUserName,
      Password: randomString(14),
      FlagNumber: $('#PassengerFlagNum').val().trim(),
    };

    const welcomeEmailInfo = {
      FirstName: $('#FirstName').val().trim(),
      Email: $('#Email').val().trim(),
      UserName: randomUserName,
      FlagNumber: $('#FlagNumber').val().trim(),
      ShirtStyle: $('#ShirtStyle').val(),
      ShirtSize: $('#ShirtSize').val().trim(),
      PassengerFirstName: $('#PassengerFirstName').val().trim(),
      PassengerLastName: $('#PassengerLastName').val().trim(),
      PassengerEmail: '',
      PassengerUserName: randomUserName,
      PassengerFlagNumber: $('#PassengerFlagNum').val().trim(),
      PassengerShirtStyle: $('#PassengerShirtStyle').val(),
      PassengerShirtSize: $('#PassengerShirtSize').val().trim(),
      EmailNotes: $('#EmailNotes').val().trim(),
    };

    // Make sure that rider first name isn't blank.
    if (!newUser.FirstName) {
      alert("Rider's First Name is required.");
      return;
    }

    // Make sure that rider last name isn't blank.
    if (!newUser.LastName) {
      alert("Rider's Last Name is required.");
      return;
    }

    // Make sure that rider email isn't blank.
    if (!newUser.Email) {
      alert("Rider's Email address is required.");
      return;
    }

    // Make sure that rider flag isn't blank.
    if (!newUser.FlagNumber) {
      alert("Rider's Flag Number is required.");
      return;
    }

    if (existingRiderFlagNumberFound) {
      alert("Rider's Flag Number must be unique.");
      return;
    }

    // Make sure that rider shirt size isn't blank.
    if (welcomeEmailInfo.ShirtStyle != 'Donation') {
      if (!welcomeEmailInfo.ShirtSize) {
        alert("Rider's Shirt Size is required.");
        return;
      }
    }

    // Check Passenger Info
    if (hasPassenger) {
      // Make sure that passenger first name isn't blank.
      if (!welcomeEmailInfo.PassengerFirstName) {
        alert("Passenger's First Name is required.");
        return;
      }

      // Make sure that passenger last name isn't blank.
      if (!welcomeEmailInfo.PassengerLastName) {
        alert("Passenger's Last Name is required.");
        return;
      }

      // Make sure that passenger flag isn't blank.
      if (!welcomeEmailInfo.PassengerFlagNumber) {
        alert("Passenger's Flag Number is required.");
        return;
      }

      if (existingPassengerFlagNumberFound) {
        alert("Passenger's Flag Number must be unique.");
        return;
      }

      // Make sure that passenger shirt size isn't blank.
      if (welcomeEmailInfo.PassengerShirtStyle != 'Donation') {
        if (!welcomeEmailInfo.PassengerShirtSize) {
          alert("Passenger's Shirt Size is required.");
          return;
        }
      }
    }

    // If shirt is donated, set a false value for ShirtSize
    if (welcomeEmailInfo.ShirtStyle == 'Donation') {
      welcomeEmailInfo.ShirtSize = 'Donated';
    }
    if (welcomeEmailInfo.PassengerShirtStyle == 'Donation') {
      welcomeEmailInfo.PassengerShirtSize = 'Donated';
    }

    // Create the new rider
    $.ajax('/api/v1/user', {
      type: 'POST',
      data: newUser,
    })
      .then((res) => {
        if (hasPassenger) {
          $.ajax('/api/v1/user', {
            type: 'POST',
            data: newPassenger,
          });
        }
        sendWelcomeEmail();
      })
      .catch(handleRegistrationError);

    function sendWelcomeEmail() {
      // Send the user a welcome email.
      $.ajax('/api/v1/welcomeemail', {
        type: 'POST',
        data: welcomeEmailInfo,
      })
        .then(() => {
          window.location.reload();
        })
        .catch(handleRegistrationError);
    }
  });

  function handleRegistrationError(err) {
    console.log(err.responseJSON.errors[0].message);
    alert(err.responseJSON.errors[0].message);
  }

  function enableSavePairingBtn() {
    if (riderFlagValid && passengerFlagValid) {
      $('#saveNewPairingBtn').attr('disabled', false);
    } else {
      $('#saveNewPairingBtn').attr('disabled', true);
    }
  }

  function countChar(val) {
    const len = val.value.length;
    if (len >= 320) {
      val.value = val.value.substring(0, 320);
      $('.characterCount').text('Characters remaining: 0');
    } else {
      remainder = 320 - len;
      $('.characterCount').text(`Characters remaining: ${remainder}`);
    }
  }
});

const randomString = (length = 14) => Math.random().toString(16).substr(2, length);
