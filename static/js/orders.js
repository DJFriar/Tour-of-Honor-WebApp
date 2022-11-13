$(document).ready(function() {
  $('#ordersTable').DataTable({
    ajax: {
      url: '/api/v1/orders',
      dataSrc: '',
    },
    columns: [
      { data: 'OrderNumber' },
      { data: 'RiderFirstName' },
      { data: 'RiderLastName' },
      { data: 'RiderShirt' },
      { data: 'PassengerName' },
      { data: 'PassengerShirt' },
      { data: 'CharityName' },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Save to Excel',
        title: 'TOH Orders',
        exportOptions: {
          modifier: {
            search: 'none'
          }
        }
      }
    ],
    pageLength: 100
  });
})