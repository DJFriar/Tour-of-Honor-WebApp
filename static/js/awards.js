$(document).ready(() => {
  const userTimeZone = $('#userTZ').data('usertz');
  $('#awardsTable').DataTable({
    ajax: {
      url: '/api/v1/admin/iba-awards',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: null, name: 'Rider' },
      { data: 'FlagNumber' },
      { data: 'FirstName' },
      { data: 'LastName' },
      { data: 'Name' },
      { data: 'RideDate' },
    ],
    columnDefs: [
      { targets: [0], visible: false },
      {
        render(data, type, row) {
          return `${row.FlagNumber} (${row.FirstName} ${row.LastName})`;
        },
        targets: [1],
      },
      { targets: [2, 3, 4], visible: false, Searchable: true },
      {
        render(data) {
          const createdDate = new Date(data);
          return `${createdDate.toLocaleString('en-US', { timeZone: userTimeZone })}`;
        },
        targets: [6],
      },
    ],
    order: [[0, 'asc']],
    pageLength: 100,
  });
});
