$(document).ready(() => {
  existingRiderFlagNumberFound = false;
  existingPassengerFlagNumberFound = false;
  hasPassenger = false;
  $('#usersTable').DataTable({
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
      { render: function (data, type, row) {
        if (data) {
          return '<div class="sendSMSTextButton" data-uid="' + row['id'] + '">' + data + ' <i class="fal fa-message-sms fa-lg"></i></div>'
        } else {
          return data
        }
      }, targets: [5] },
      { render: function (data, type, row) {
        return '<div class="editUserButton" data-uid="' + row['id'] + '"><i class="fal fa-edit fa-lg"></i> Edit Rider</div>'
      }, targets: [6]}
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Save to Excel',
        title: 'TOH Active Riders',
        exportOptions: {
          modifier: {
            search: 'none',
          },
        },
      },
    ],
    pageLength: 100,
  });
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
  $('#usersTable').on('click', '.editUserButton', function () {
    const id = $(this).data('uid');
    $('#userDetailEditModal').css('display', 'block');
    $.ajax(`/api/v1/riderInfo/${id}`, {
      type: 'GET',
    }).then((res) => {
      $('#EditUserID').val(res.id);
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

  // Handle Text Rider Button
  $('#usersTable').on('click', '.sendSMSTextButton', function () {
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

  // Charaacter counter for Text Message box
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
  $('#usersTable').on('click', '.sendProfileEmailButton', function () {
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

      // Make sure that passenger email isn't blank.
      // if (!welcomeEmailInfo.PassengerEmail) {
      //   alert("Passenger's Email address is required.");
      //   return;
      // }

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
