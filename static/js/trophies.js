$(document).ready(() => {
  // Handle Trophies
  $('#awardTrophy').on('click', () => {
    const regionID = $('#TrophyRegion').val();
    const trophyPlace = $('#TrophyPlace').val();
    const flagNumber = $('#FlagNumber').val();
    const trophyData = {
      RegionID: regionID,
      TrophyPlace: trophyPlace,
      FlagNumber: flagNumber,
    };

    $.ajax('/api/v1/award-trophy', {
      type: 'PUT',
      data: trophyData,
    }).then(() => {
      location.reload();
    });
  });
});
