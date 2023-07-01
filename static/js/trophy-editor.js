$(document).ready(() => {
  const userTimeZone = $('#userTZ').data('usertz');
  $('#awardTable').DataTable({
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
      { data: '', name: 'Actions' },
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
      {
        render(data, type, row) {
          const deleteAwardIcon = `<span class="deleteAwardButton toh-mr-4" uk-tooltip="Click to delete this award." data-uid="${row.id}"><i class="fa-light fa-trash-can fa-lg"></i>&nbsp;</span>`;
          const actions = `<span style="white-space:nowrap;">${deleteAwardIcon}</span>`;
          return actions;
        },
        targets: [7],
      },
    ],
    lengthChange: false,
    order: [[0, 'asc']],
    pageLength: 100,
  });

  // Handle Trophies
  $('#awardTrophy').on('click', () => {
    const regionID = $('#TrophyRegion').val();
    const trophyPlace = $('#TrophyPlace').val();
    const flagNumbers = $('#FlagNums').val();
    const trophyData = {
      RegionID: regionID,
      TrophyPlace: trophyPlace,
      FlagNumbers: flagNumbers,
    };

    $.ajax('/api/v1/award-trophy', {
      type: 'PUT',
      data: trophyData,
    }).then(() => {
      location.reload();
    });
  });

  // Handle Awards
  $('#grantAward').on('click', () => {
    const awardName = $('#AwardName').val();
    const flagNumber = $('#FlagNumber').val();
    const awardDate = $('#Date').val();
    const awardData = {
      AwardName: awardName,
      AwardDate: awardDate,
      FlagNumber: flagNumber,
    };

    $.ajax('/api/v1/award-iba', {
      type: 'PUT',
      data: awardData,
    }).then(() => {
      location.reload();
    });
  });

  // Handle Delete Award Button
  $('#awardTable').on('click', '.deleteAwardButton', function () {
    const id = $(this).data('uid');
    $.ajax(`/api/v1/award-iba/${id}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });
});
