$(document).ready(() => {
  $('#ordersTable').DataTable({
    ajax: {
      url: '/api/v1/orders',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: '', width: '54px' },
      { data: 'OrderNumber' },
      { data: 'NextStep' },
      { data: 'RiderFirstName' },
      { data: 'RiderLastName' },
      { data: 'RiderEmail' },
      { data: 'RiderFlagNumber' },
      { data: 'RiderShirt' },
      { data: 'PassengerName' },
      { data: 'PassFlagNumber' },
      { data: 'PassengerShirt' },
      { data: 'CharityName' },
      { data: 'isNew' },
      { data: 'applyFlagSurcharge' },
      { data: 'FlagSurchargeOrderNumber' },
      { data: 'CellNumber' },
      { data: 'RiderID' },
    ],
    columnDefs: [
      { targets: [0, 6, 13, 14, 15, 16, 17], visible: false },
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
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Save to Excel',
        title: 'TOH Orders',
        exportOptions: {
          modifier: {
            search: 'none',
          },
        },
      },
    ],
    order: [[2, 'desc']],
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
