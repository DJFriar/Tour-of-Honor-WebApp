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
      { data: 'Address' },                      // 19
      { data: 'City' },                         // 20
      { data: 'State' },                        // 21
      { data: 'ZipCode' },                      // 22
    ],
    columnDefs: [
      { targets: [0, 6, 14, 15, 16, 17, 18, 19, 20, 21, 22], visible: false },
      { render: function (data, type, row) {
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
      }, targets: [1] },
      { render: function (data, type, row) {
        const createdDate = new Date(data);
        return `${createdDate.toLocaleString('en-US', { timeZone: userTimeZone })}`;
      }, targets: [13] },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Download Paid Orders',
        title: 'TOH Paid Orders',
        exportOptions: {
          columns: [7, 4, 5, 6, 10, 9, 19, 20, 21, 22, 8, 11, 12, 2, 13],
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

  // Handle Flag Surcharge Check
  $('#ordersTable').on('click', '.flagSurchargeIndicator', function () {
    const oid = $(this).data('orderid');
    $.ajax(`/api/v1/orders/checkFlagOrderStatus/${oid}`, {
      type: 'GET',
    }).then(() => {
      location.reload();
    });
  })

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

});
