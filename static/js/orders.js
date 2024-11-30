$(document).ready(() => {
  const userTimeZone = $('#userTZ').data('usertz');

  $('#ordersTable').DataTable({
    ajax: {
      url: '/api/v1/orders',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },                           // 0
      { data: '', width: '54px' },              // 1
      { data: 'OrderNumber' },                  // 2
      { data: 'NextStep' },                     // 3
      { data: 'RiderFirstName' },               // 4
      { data: 'RiderLastName' },                // 5
      { data: 'RiderEmail' },                   // 6
      { data: 'RiderFlagNumber' },              // 7
      { data: 'RiderShirt' },                   // 8
      { data: 'PassengerName' },                // 9
      { data: 'PassFlagNumber' },               // 10
      { data: 'PassengerShirt' },               // 11
      { data: 'CharityName' },                  // 12
      { data: 'updatedAt', type: 'date' },      // 13
      { data: 'isNew' },                        // 14
      { data: 'applyFlagSurcharge' },           // 15
      { data: 'FlagSurchargeOrderNumber' },     // 16
      { data: 'CellNumber' },                   // 17
      { data: 'RiderID' },                      // 18
      { data: 'PassUserID' },                   // 19
      { data: 'Address' },                      // 20
      { data: 'City' },                         // 21
      { data: 'State' },                        // 22
      { data: 'ZipCode' },                      // 23
    ],
    columnDefs: [
      { targets: [0, 6, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], visible: false },
      {
        render: function (data, type, row) {
          const riderEmailIcon = `<span class="toh-mr-4" uk-tooltip="Click to send email to ${row['RiderEmail']}."><a href="mailto:${row['RiderEmail']}"><i class="fa-light fa-envelope"></i></a>&nbsp;</span>`;
          const riderPhoneIcon = `<span class="sendSMSTextButton toh-mr-4" uk-tooltip="Click to send text to ${row['CellNumber']}." data-uid="${row['RiderID']}"><i class="fa-light fa-message-sms"></i>&nbsp;</span>`;
          const riderIsNewIcon = '<span class="toh-mr-4" uk-tooltip="Rider is new to TOH."><i class="fa-duotone fa-sparkles" style="--fa-primary-color: orange; --fa-secondary-color: orangered;"></i>&nbsp;</span>';
          const flagSurchargeRequiredIcon = `<span class="flagSurchargeIndicator" uk-tooltip="Flag surcharge not paid, click to re-check." data-orderid="${row['id']}"><i class="fa-duotone fa-flag" style="--fa-primary-color: red; --fa-secondary-color: red;"></i></span>&nbsp;`;
          const flagSurchargePaidIcon = `<span class="flagSurchargeIndicator" uk-tooltip="Flag surcharge already paid." data-orderid="${row['id']}"><i class="fa-duotone fa-flag" style="--fa-primary-color: green; --fa-secondary-color: green;"></i></span>&nbsp;`;
          let response = `<span style="white-space:nowrap;">${riderEmailIcon}`;
          if (row['CellNumber']) {
            response += `${riderPhoneIcon}`
          }
          if (row['applyFlagSurcharge'] > 0) {
            if (row['FlagSurchargeOrderNumber']) {
              response += `${flagSurchargePaidIcon}`
            } else {
              response += `${flagSurchargeRequiredIcon}`
            }
          }
          if (row['isNew']) {
            response += `${riderIsNewIcon}`
          }
          response += '</span>'
          return response;
        }, targets: [1]
      },
      {
        render: function (data, type, row) {
          if (row['NextStep'] === 'Payment') {
            return `<span class="fixMissingOrderBtn" uk-tooltip="Add Missing Order #" data-orderid="${row['id']}">${data}</span>`
          }
          if (row['NextStep'] === 'Flag Number') {
            return `<span id="assignFlagNumberBtn" class="assignFlagNumberBtn" uk-tooltip="Assign Rider Flag #" data-orderid="${row['id']}" data-whoami="rider" data-userid="${row['RiderID']}">${data}</span>`
          }
          return data;
        }, targets: [3]
      },
      {
        render: function (data, type, row) {
          if (row['NextStep'] === 'Flag Number') {
            return `<span id="assignPassFlagNumberBtn" class="assignPassFlagNumberBtn" uk-tooltip="Assign Passenger Flag #" data-orderid="${row['id']}" data-whoami="passenger" data-userid="${row['PassUserID']}">${data}</span>`
          }
          return data;
        }, targets: [9]
      },
      {
        render: function (data, type, row) {
          const createdDate = new Date(data);
          return `${createdDate.toLocaleString('en-US', { timeZone: userTimeZone })}`;
        }, targets: [13]
      },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Download Paid Orders',
        title: 'TOH Paid Orders',
        exportOptions: {
          columns: [7, 4, 5, 6, 10, 9, 20, 21, 22, 23, 8, 11, 12, 2, 13],
          modifier: {
            search: 'none',
          },
        },
        sheetName: 'Paid Orders',
      },
    ],
    order: [[13, 'desc']],
    pageLength: 100,
  });

  // Handle Add Missing Order Number Button to Open Modal
  $('#ordersTable').on('click', '.fixMissingOrderBtn', function () {
    const fixingOrderID = $(this).data('orderid');
    $('#fixMissingOrderNumberModal').css('display', 'block');
    $('#saveMissingOrderNumberBtn').data('orderid', fixingOrderID);
  });

  // Handle Save Order Number Button
  $('#saveMissingOrderNumberBtn').on('click', function () {
    const AssignedUserID = $(this).data('userid');
    const AssignedOrderID = $(this).data('orderid');
    const OrderNumber = $('#missingOrderNumber').val().trim();
    const OrderInfo = {
      RegStep: 'PaymentFix',
      OrderID: AssignedOrderID,
      OrderNumber: OrderNumber,
    };

    if (!OrderNumber) {
      showToastrError('An order number is required.');
      $('#missingOrderNumber').val('');
      // $('#saveMissingOrderNumberBtn').prop('disabled', true);
    }

    if (OrderNumber && OrderNumber > 1) {
      $.ajax('/api/v1/regFlow', {
        beforeSend() {
          $('.modal').css('display', 'none');
          $('.spinnerBox').removeClass('hide-me');
        },
        complete() {
          $('.spinnerBox').addClass('hide-me');
        },
        type: 'POST',
        data: OrderInfo,
      })
        .then(() => {
          location.reload();
        })
        .catch(() => {
          showToastrError('An error occured while updating this order.');
        });
    }
  });

  // Handle Flag Surcharge Check
  $('#ordersTable').on('click', '.flagSurchargeIndicator', function () {
    const oid = $(this).data('orderid');
    $.ajax(`/api/v1/orders/checkFlagOrderStatus/${oid}`, {
      type: 'GET',
    }).then(() => {
      location.reload();
    });
  })

  // Handle Assign Rider Flag Number Button to Open Modal
  $('#ordersTable').on('click', '#assignFlagNumberBtn', function () {
    const AssigneeUserID = $(this).data('userid');
    const AssigneeOrderID = $(this).data('orderid');
    $('#assignFlagNumberModal').css('display', 'block');
    $('#saveFlagAssignmentBtn').data('orderid', AssigneeOrderID);
    $('#saveFlagAssignmentBtn').data('userid', AssigneeUserID);
    $('#saveFlagAssignmentBtn').data('whoami', 'rider');
  });

  // Handle Assign Passenger Flag Number Button to Open Modal
  $('#ordersTable').on('click', '#assignPassFlagNumberBtn', function () {
    const AssigneeUserID = $(this).data('userid');
    const AssigneeOrderID = $(this).data('orderid');
    $('#assignPassFlagNumberModal').css('display', 'block');
    $('#savePassFlagAssignmentBtn').data('orderid', AssigneeOrderID);
    $('#savePassFlagAssignmentBtn').data('userid', AssigneeUserID);
    $('#savePassFlagAssignmentBtn').data('whoami', 'passenger');
  });

  // Handle getNextAvailableFlagNumber Button
  $('#getNextAvailableFlagNumber').on('click', (e) => {
    e.preventDefault();
    $.ajax('/api/v1/flag/nextAvailable', {
      type: 'GET',
    }).then((flagNumber) => {
      if (flagNumber > 0) {
        $('#AssignedFlagNumber').val(flagNumber);
        $('#saveFlagAssignmentBtn').prop('disabled', false);
      }
    });
  });

  // Handle getNextAvailablePassFlagNumber Button
  $('#getNextAvailablePassFlagNumber').on('click', (e) => {
    e.preventDefault();
    $.ajax('/api/v1/flag/nextAvailable', {
      type: 'GET',
    }).then((flagNumber) => {
      if (flagNumber > 0) {
        $('#AssignedPassFlagNumber').val(flagNumber);
        $('#savePassFlagAssignmentBtn').prop('disabled', false);
      }
    });
  });

  // Handle Save Rider Flag Assignment Button
  $('#saveFlagAssignmentBtn').on('click', function () {
    const AssignedUserID = $(this).data('userid');
    const AssignedOrderID = $(this).data('orderid');
    const assignedFlagNumber = $('#AssignedFlagNumber').val().trim();
    const FlagAssignmentInfo = {
      RegStep: 'FlagAssignment',
      RallyYear: 2025,
      UserID: AssignedUserID,
      OrderID: AssignedOrderID,
      whoami: 'rider',
      assignedFlagNumber: assignedFlagNumber,
    };

    if (!assignedFlagNumber || assignedFlagNumber < 11) {
      showToastrError('A flag number is required.');
      $('#assignedFlagNumber').val('');
      $('#flagAvailabilityResponse').addClass('hide-me');
      $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
    }

    // if (assignedFlagNumber >= 3000) {
    //   showToastrError('Flag numbers must be lower than 3000.');
    //   $('#assignedFlagNumber').val('');
    //   $('#flagAvailabilityResponse').addClass('hide-me');
    //   $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
    // }

    // if (assignedFlagNumber > 10 && assignedFlagNumber < 3000) {
    if (assignedFlagNumber > 10) {
      $.ajax('/api/v1/regFlow', {
        beforeSend() {
          $('.modal').css('display', 'none');
          $('.spinnerBox').removeClass('hide-me');
        },
        complete() {
          $('.spinnerBox').addClass('hide-me');
        },
        type: 'POST',
        data: FlagAssignmentInfo,
      })
        .then(() => {
          location.reload();
        })
        .catch(() => {
          showToastrError('An error occured while assigning that flag.');
        });
    }
  });

  // Handle Save Passenger Flag Assignment Button
  $('#savePassFlagAssignmentBtn').on('click', function () {
    const AssignedPassUserID = $(this).data('userid');
    const AssignedPassOrderID = $(this).data('orderid');
    const assignedPassFlagNumber = $('#AssignedPassFlagNumber').val().trim();
    const FlagAssignmentInfo = {
      RegStep: 'PassFlagAssignment',
      RallyYear: 2025,
      UserID: AssignedPassUserID,
      OrderID: AssignedPassOrderID,
      whoami: 'passenger',
      assignedPassFlagNumber: assignedPassFlagNumber,
    };

    if (!assignedPassFlagNumber || assignedPassFlagNumber < 11) {
      showToastrError('A flag number is required.');
      $('#AssignedPassFlagNumber').val('');
      $('#flagAvailabilityResponse').addClass('hide-me');
      $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
    }

    if (assignedPassFlagNumber > 10) {
      $.ajax('/api/v1/regFlow', {
        beforeSend() {
          $('.modal').css('display', 'none');
          $('.spinnerBox').removeClass('hide-me');
        },
        complete() {
          $('.spinnerBox').addClass('hide-me');
        },
        type: 'POST',
        data: FlagAssignmentInfo,
      })
        .then(() => {
          location.reload();
        })
        .catch(() => {
          showToastrError('An error occured while assigning that flag.');
        });
    }
  });

  // Handle Text Rider Button
  $('#ordersTable').on('click', '.sendSMSTextButton', function () {
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

  // Handle Edit User Dialog Close Button
  $('.close').on('click', () => {
    $('.modal').css('display', 'none');
  });

  // Handle Edit Dialog Cancel Button
  $('.cancelButton').on('click', () => {
    $('.modal').css('display', 'none');
  });

  // Show Toastr Alert
  function showToastrError(message) {
    const toastrOptions = {
      closeButton: 'true',
      positionClass: 'toast-top-center',
      preventDuplicates: 'true',
      progressBar: 'true',
      timeOut: '2500',
    };

    toastr.error(message, null, toastrOptions);
  }

});
