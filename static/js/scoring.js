$(document).ready(() => {
  const userTimeZone = $('#userTZ').data('usertz');
  // Create the Pending Table
  const pendingTable = $('#PendingTable').DataTable({
    ajax: {
      url: '/api/v1/submission/pending',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: null, name: 'Rider' },
      { data: 'Code' },
      { data: 'CatName' },
      { data: null, name: 'Location' },
      { data: 'createdAt', type: 'date' },
      { data: 'Status' },
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
                return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-light fa-square-question"></i></a>`;
              case 2:
                return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-brands fa-apple"></i></a>`;
              case 3:
                return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-brands fa-android"></i></a>`;
              case 4:
                return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-solid fa-browser"></i></a>`;
              case 5:
                return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-light fa-envelope"></i></a>`;
              case 6:
                return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-brands fa-usps"></i></a>`;
              default:
                return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-light fa-square-question"></i></a>`;
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
          if (row.OtherRiders) {
            return `${row.City}, ${row.State}&nbsp;<a href="https://maps.google.com/maps?t=m&q=loc:${row.Latitude},${row.Longitude}" target="_blank"><span class=""><i class="fa-duotone fa-map-location-dot"></i></span></a>`;
          }
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
      { targets: [6, 7, 11, 15], visible: false, Searchable: false },
      { targets: [8, 9, 10, 12, 13, 14], visible: false, Searchable: true },
    ],
    language: {
      entries: {
        _: 'submissions',
        1: 'submission',
      },
    },
    layout: {
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging',
    },
    pageLength: 100,
    order: [[0, 'asc']],
  });

  // Create the Held for Review Table
  $('#HeldTable').DataTable({
    ajax: {
      url: '/api/v1/submission/held',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: null, name: 'Rider' },
      { data: 'Code' },
      { data: 'CatName' },
      { data: null, name: 'Location' },
      { data: 'createdAt', type: 'date' },
      { data: 'Status' },
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
          switch (row.Source) {
            case 1:
              return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-light fa-square-question"></i></a>`;
            case 2:
              return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-brands fa-apple"></i></a>`;
            case 3:
              return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-brands fa-android"></i></a>`;
            case 4:
              return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-solid fa-browser"></i></a>`;
            case 5:
              return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-light fa-envelope"></i></a>`;
            case 6:
              return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-brands fa-usps"></i></a>`;
            default:
              return `<a href="/submission/${data}">${data}&nbsp;<i class="fa-light fa-square-question"></i></a>`;
          }
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
          if (row.OtherRiders) {
            return `${row.City}, ${row.State}&nbsp;<a href="https://maps.google.com/maps?t=m&q=loc:${row.Latitude},${row.Longitude}" target="_blank"><span class=""><i class="fa-duotone fa-map-location-dot"></i></span></a>`;
          }
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
      { targets: [6, 7, 11, 15], visible: false, Searchable: false },
      { targets: [8, 9, 10, 12, 13, 14], visible: false, Searchable: true },
    ],
    language: {
      entries: {
        _: 'submissions',
        1: 'submission',
      },
    },
    layout: {
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging',
    },
    pageLength: 50,
    order: [[0, 'asc']],
  });

  // Force tables to be full width
  $('table#PendingTable').css('width', '100%');
  $('table#HeldTable').css('width', '100%');
  $('table#ScoredTable').css('width', '100%');

  // Handle Filter Buttons on Pending Table
  localStorage.setItem('categoryFilter', 'All');

  $('.showAllSubmissions').on('click', () => {
    $('.submissionFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.submissionFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showAllSubmissions').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('All');
  });
  $('.showTOHSubmissions').on('click', () => {
    $('.submissionFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.submissionFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showTOHSubmissions').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('Tour of Honor');
  });
  $('.show911Submissions').on('click', () => {
    $('.submissionFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.submissionFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.show911Submissions').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('9/11');
  });
  $('.showDBSubmissions').on('click', () => {
    $('.submissionFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.submissionFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showDBSubmissions').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('Doughboys');
  });
  $('.showGSFSubmissions').on('click', () => {
    $('.submissionFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.submissionFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showGSFSubmissions').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('Gold Star Family');
  });
  $('.showK9Submissions').on('click', () => {
    $('.submissionFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.submissionFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showK9Submissions').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('War Dogs / K9');
  });
  $('.showMadonnaSubmissions').on('click', () => {
    $('.submissionFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.submissionFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showMadonnaSubmissions').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('Madonna Trail');
  });
  $('.showHueySubmissions').on('click', () => {
    $('.submissionFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.submissionFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showHueySubmissions').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('Hueys');
  });
  $('.showSOLMemorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showSOLMemorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('Statue of Liberty');
  });
  $('.showCemeteryMemorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showCemeteryMemorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setSubmissionFilter('Cemetery');
  });

  function setSubmissionFilter(category) {
    localStorage.setItem('categoryFilter', category);
    if (category === 'All') {
      pendingTable.column(3).search('').draw();
      // pendingTableData = pendingTable.rows({ order: 'current', search: 'applied' }).data();
    } else {
      pendingTable.column(3).search(category).draw();
      // pendingTableData = pendingTable.rows({ order: 'current', search: 'applied' }).data();
    }
  }
});
