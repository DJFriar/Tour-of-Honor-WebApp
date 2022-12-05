$(document).ready(() => {
  $('#ordersTable').DataTable({
    ajax: {
      url: '/api/v1/orders',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'OrderNumber' },
      { data: 'NextStep' },
      { data: 'RiderFirstName' },
      { data: 'RiderLastName' },
      { data: 'RiderEmail' },
      { data: 'RiderFlagNumber', type: 'num' },
      { data: 'RiderShirt' },
      { data: 'PassengerName' },
      { data: 'PassFlagNumber', type: 'num'  },
      { data: 'PassengerShirt' },
      { data: 'CharityName' },
      { data: 'isNew' },
      { data: 'applyFlagSurcharge' },
      { data: 'FlagSurchargeOrderNumber' },
    ],
    columnDefs: [
      { targets: [0, 12, 13, 14], visible: false },
      { render: function (data, type, row) {
        if (row['isNew']) {
          return `<span>${data}&nbsp;<i class="fa-duotone fa-sparkles" style="--fa-primary-color: orange; --fa-secondary-color: orangered;"></i></span>`
        } else {
          return data
        }
      }, targets: [1] },
      { render: function (data, type, row) {
        if (row['applyFlagSurcharge'] > 0) {
          if (row['FlagSurchargeOrderNumber']) {
            return `<span class="flagSurchargeIndicator" data-orderid="${row['id']}">${data}&nbsp;<i class="fa-duotone fa-flag" style="--fa-primary-color: green; --fa-secondary-color: green;"></i></span>`
          } else {
            return `<span class="flagSurchargeIndicator" data-orderid="${row['id']}">${data}&nbsp;<i class="fa-duotone fa-flag" style="--fa-primary-color: red; --fa-secondary-color: red;"></i></span>`
          }
        } else {
          return data
        }
      }, targets: [6, 9] },
      { render: DataTable.render.number('', null, 0), targets: [1] }
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

});
