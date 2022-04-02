$(document).ready(() => {
  // Handle Trophies
  $("#awardTrophy").on("click", function() {
    var regionID = $("#TrophyRegion").val();
    var trophyPlace = $("#TrophyPlace").val();
    var flagNumbers = $("#FlagNums").val();
    var trophyData = {
      RegionID: regionID,
      TrophyPlace: trophyPlace,
      FlagNumbers: flagNumbers,
    };

    $.ajax("/api/v1/award-trophy", {
      type: "PUT",
      data: trophyData
    }).then(
      function() { location.reload(); }
    );
  });
})