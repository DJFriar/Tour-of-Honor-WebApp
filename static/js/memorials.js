$(document).ready(() => {
  const memorialsTable = $('#memorialsTable').DataTable({
    ajax: {
      url: '/api/v1/memorials',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'Code' },
      { data: 'CategoryName' },
      { data: 'Name' },
      { data: 'City' },
      { data: 'State' },
      { data: 'Access' },
      { data: 'RestrictionName' },
      { data: '', name: 'Actions' },
      { data: 'URL' },
      { data: 'Latitude' },
      { data: 'Longitude' },
    ],
    columnDefs: [
      { targets: [0, 9, 10, 11], visible: false },
      {
        render(data) {
          return `<span style="font-family: 'Source Code Pro', monospace;"><a href="/memorial/${data}">${data}</a></span>`;
        },
        targets: [1],
      },
      {
        render(data, type, row) {
          if (row.URL) {
            return `<a href="${row.URL}" target="_blank">${data}</a>`;
          }
          return data;
        },
        targets: [3],
      },
      {
        render(data) {
          if (data === 'None') {
            return data;
          }
          return `<span style="color: red;">${data}</span>`;
        },
        targets: [7],
      },
      {
        render(data, type, row) {
          return `<a href="https://maps.google.com/maps?t=m&q=loc:${row.Latitude},${row.Longitude}" target="_blank"><span class=""><i class="fa-duotone fa-map-location-dot"></i></span></a>`;
        },
        targets: [8],
      },
    ],
    dom: 'frtip',
    pageLength: 100,
  });

  localStorage.setItem('memorialCategoryFilter', 'Tour of Honor');

  // const tableData = memorialsTable.rows().data();

  // Handle Filter Buttons
  $('.showAllMemorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showAllMemorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setMemorialFilter('All');
  });
  $('.showTOHMemorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showTOHMemorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setMemorialFilter('Tour of Honor');
  });
  $('.show911Memorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.show911Memorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setMemorialFilter('9/11');
  });
  $('.showDBMemorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showDBMemorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setMemorialFilter('Doughboys');
  });
  $('.showGSFMemorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showGSFMemorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setMemorialFilter('Gold Star Family');
  });
  $('.showK9Memorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showK9Memorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setMemorialFilter('War Dogs / K9');
  });
  $('.showMadonnaMemorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showMadonnaMemorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setMemorialFilter('Madonna Trail');
  });
  $('.showHueyMemorials').on('click', () => {
    $('.MemorialFilterButton')
      .prevAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.MemorialFilterButton')
      .nextAll()
      .removeClass('uk-button-primary')
      .addClass('uk-button-secondary');
    $('.showHueyMemorials').removeClass('uk-button-secondary').addClass('uk-button-primary');
    setMemorialFilter('Hueys');
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
    setMemorialFilter('Statue of Liberty');
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
    setMemorialFilter('Cemetery');
  });

  function setMemorialFilter(category) {
    localStorage.setItem('memorialCategoryFilter', category);
    if (category === 'All') {
      memorialsTable.column(2).search('').draw();
      memorialsTable.rows({ order: 'current', search: 'applied' }).data();
    } else {
      memorialsTable.column(2).search(category).draw();
      memorialsTable.rows({ order: 'current', search: 'applied' }).data();
    }
  }

  const userTZ = $('#releaseDate').data('tzf');
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: userTZ })).getTime();

  const tzShort = new Date()
    .toLocaleString('default', { timeZone: userTZ, timeZoneName: 'short' })
    .slice(-3);
  const releaseDate = new Date('Apr 1, 2023 00:01:00 EDT');
  const deadline = releaseDate.getTime();
  $('#releaseDate').html(
    releaseDate.toLocaleString('en-US', {
      day: 'numeric',
      hour: 'numeric',
      month: 'long',
      minute: 'numeric',
      second: '2-digit',
      timeZone: 'America/New_York',
      timeZoneName: 'short',
      year: 'numeric',
    }),
  );

  const x = setInterval(() => {
    const t = deadline - now;
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((t % (1000 * 60)) / 1000);
    document.getElementById(
      'countdownTimer',
    ).innerHTML = `T- ${days}d ${hours}h ${minutes}m ${seconds}s (Using ${tzShort})`;
    if (t < 0) {
      clearInterval(x);
      document.getElementsByClassName('toh-alert').addClass('hide-me');
    }
  }, 1000);

  // $('#userLocalTime').text(`${userDateTime} | ${releaseDateTime} | TimeLeft: ${countdown}`);
});
