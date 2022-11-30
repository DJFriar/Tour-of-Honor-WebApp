$(document).ready(() => {
  $('#ordersTable').DataTable({
    ajax: {
      url: '/api/v1/orders',
      dataSrc: '',
    },
    columns: [
      { data: 'OrderNumber' },
      { data: 'NextStep' },
      { data: 'RiderFirstName' },
      { data: 'RiderLastName' },
      { data: 'RiderFlagNumber', type: 'num' },
      { data: 'RiderShirt' },
      { data: 'PassengerName' },
      { data: 'PassFlagNumber', type: 'num'  },
      { data: 'PassengerShirt' },
      { data: 'CharityName' },
      { data: 'isNew' },
    ],
    columnDefs: [
      { targets: [10], visible: false },
      { render: function (data, type, row) {
        if (row['isNew']) {
          return '<span>' + data + ' <i class="fa-duotone fa-sparkles" style="--fa-primary-color: orange; --fa-secondary-color: orangered;"></i></span>'
        } else {
          return data
        }
      }, targets: [0] },
      { render: DataTable.render.number('', null, 0), targets: [0] }
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
});
