$(document).ready(() => {
  $('#awardTable').DataTable({
    // "order": [[ 3, "desc" ]],
    "pageLength": 25
  });

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

  // Handle Awards
  $("#grantAward").on("click", function() {
    var awardName = $("#AwardName").val();
    var flagNumber = $("#FlagNum").val();
    var awardDate = $("#Date").val();
    var awardData = {
      AwardName: awardName,
      AwardDate: awardDate,
      FlagNumber: flagNumber,
    };

    $.ajax("/api/v1/award-iba", {
      type: "PUT",
      data: awardData
    }).then(
      function() { location.reload(); }
    );
  });

  // Handle Delete Award Button
  $(".deleteAwardButton").on("click", function() {
    var id = $(this).data("uid");
    $.ajax("/api/v1/award-iba/" + id, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  });
})





























