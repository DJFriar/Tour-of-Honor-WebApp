$(document).ready(() => {
  // Handle Trophies
  $("#awardTrophy").on("click", function() {
    var regionID = $("#TrophyRegion").val();
    var trophyPlace = $("#TrophyPlace").val();
    var flagNumber = $("#FlagNum").val();
    var trophyData = {
      RegionID: regionID,
      TrophyPlace: trophyPlace,
      FlagNumber: flagNumber,
    };

    $.ajax("/api/v1/award-trophy", {
      type: "PUT",
      data: trophyData
    }).then(
      function() { location.reload(); }
    );
  });
})