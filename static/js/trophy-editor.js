$(document).ready(() => {
  $('#awardTable').DataTable({
    // "order": [[ 3, "desc" ]],
    pageLength: 25,
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
  $('.deleteAwardButton').on('click', function () {
    const id = $(this).data('uid');
    $.ajax(`/api/v1/award-iba/${id}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });
});
