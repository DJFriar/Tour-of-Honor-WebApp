$(document).ready(() => {
  // Handle Memorial Earned Button
  $("#markMemorialEarned").on("click", function() {
    var memorialCode = $("#MemorialCode").val();
    var flagNumber = $("#FlagNum").val();
    var earnedMemorial = {
      MemorialCode: memorialCode,
      FlagNumber: flagNumber,
    };

    $.ajax("/handle-alt-entry", {
      type: "PUT",
      data: earnedMemorial
    }).then(
      function() { location.reload(); }
    );
  });
})