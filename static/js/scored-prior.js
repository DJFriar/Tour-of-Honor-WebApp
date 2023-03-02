$(document).ready(() => {
  const userTimeZone = $('#userTZ').data('usertz');
  // Create the New Scored Table
  $('#HistoricalScoredTable').DataTable({
    ajax: {
      url: '/api/v1/submission/scored/2022',
      dataSrc: '',
    },
    deferRender: true,
    columns: [
      { data: 'id' },
      { data: null, name: 'Rider' },
      { data: 'Code' },
      { data: 'CatName' },
      { data: null, name: 'Location' },
      { data: 'createdAt' },
      { data: 'Status' },
      { data: 'updatedAt' },
      { data: 'ScorerNotes' },
      { data: 'RiderNotes' },
      { data: 'OtherRiders' },
      { data: 'Source' },
      { data: 'FirstName' },
      { data: 'LastName' },
      { data: 'FlagNumber' },
      { data: 'Latitude' },
      { data: 'Longitude' },
    ],
    columnDefs: [
      {
        render(data, type, row) {
          if (type === 'display') {
            switch (row.Source) {
              case 1:
                return `<a href="/submission/${data}" target="_blank">${data}&nbsp;<i class="fa-light fa-square-question"></i></a>`;
              case 2:
                return `<a href="/submission/${data}" target="_blank">${data}&nbsp;<i class="fa-brands fa-apple"></i></a>`;
              case 3:
                return `<a href="/submission/${data}" target="_blank">${data}&nbsp;<i class="fa-brands fa-android"></i></a>`;
              case 4:
                return `<a href="/submission/${data}" target="_blank">${data}&nbsp;<i class="fa-solid fa-browser"></i></a>`;
              case 5:
                return `<a href="/submission/${data}" target="_blank">${data}&nbsp;<i class="fa-light fa-envelope"></i></a>`;
              case 6:
                return `<a href="/submission/${data}" target="_blank">${data}&nbsp;<i class="fa-brands fa-usps"></i></a>`;
              default:
                return `<a href="/submission/${data}" target="_blank">${data}&nbsp;<i class="fa-light fa-square-question"></i></a>`;
            }
          }
          return data;
        },
        targets: [0],
      },
      {
        render(data, type, row) {
          return `${row.FlagNumber} (${row.FirstName} ${row.LastName})`;
        },
        targets: [1],
      },
      {
        render(data) {
          return `<a href="/memorial/${data}" target="_blank">${data}</a>`;
        },
        targets: [2],
      },
      {
        render(data, type, row) {
          return `${row.City}, ${row.State}&nbsp;<a href="https://maps.google.com/maps?t=m&q=loc:${row.Latitude},${row.Longitude}" target="_blank"><span class=""><i class="fa-duotone fa-map-location-dot"></i></span></a>`;
        },
        targets: [4],
      },
      {
        render(data) {
          const createdDate = new Date(data);
          return `${createdDate.toLocaleString('en-US', { timeZone: userTimeZone })}`;
        },
        targets: [5],
      },
      {
        render(data, type, row) {
          switch (row.Status) {
            case 1:
              return `<span><i class="fa-solid fa-shield-check" color="green"></i></span>&nbsp;Approved`;
            case 2:
              return `<span><i class="fa-solid fa-shield-exclamation" color="red"></i></span>&nbsp;Rejected`;
            default:
              return `[ERROR]`;
          }
        },
        targets: [6],
      },
      {
        render(data) {
          const updatedDate = new Date(data);
          return `${updatedDate.toLocaleString('en-US', { timeZone: userTimeZone })}`;
        },
        targets: [7],
      },
      { targets: [11, 15, 16], visible: false, Searchable: false },
      { targets: [8, 9, 10, 12, 13, 14], visible: false, Searchable: true },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Save to Excel',
        title: 'TOH Scored Submissions',
        exportOptions: {
          modifier: {
            search: 'none',
          },
        },
      },
    ],
    pageLength: 50,
  });
});
