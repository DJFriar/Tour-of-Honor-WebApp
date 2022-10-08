$(document).ready(function() {
  $('#memorialTextTable').DataTable({
    pageLength: 10,
    columns: [
      { "width": "15%" },
      { "width": "70%" },
      null
    ]
  });

  // Handle Add New Memorial Text toggle
  $(".addMemorialTextBtn").on("click", function(e) {
    e.preventDefault();
    $("#addMemorialTextInfo").toggleClass("hide-me");
    $(".memorialTextBtnDiv").toggleClass("hide-me");
  });

  // Handle Edit Memorial Text Button
  $(".editMemTextBtn").on("click", function() {
    var id = $(this).data("uid");
    $("#memorialTextEditModal").css("display","block");
    $(".uk-dropdown").removeClass("uk-open");
    $.ajax("/api/v1/memorial-text/"+ id, {
      type: "GET",
    }).then(
      function(res) {
        $("#EditMemorialID").val(res.MemorialID);
        $("#EditMemorialTextID").val(res.id);
        $("#MemorialTextHeading").val(res.Heading);
        $("#MemorialText").val(res.Text);
      }
    )
  });

  // Handle Delete Memorial Button
  $(".deleteMemTextBtn").on("click", function() {
    var id = $(this).data("uid");
    $.ajax("/api/v1/memorial-text/" + id, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  });

  // Handle Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  });

  // Handle Dialog Cancel Button
  $(".cancelButton").on("click", function() {
    $(".modal").css("display","none");
  });

  // Handle Save Changes Button
  $("#saveMemTextChangesBtn").on("click", function(e) {
    e.preventDefault();
    var memTextID = $("#EditMemorialTextID").val();
    var memID = $("#EditMemorialID").val();
    var updateMemText = {
      id: memTextID,
      MemorialID: memID,
      Heading: $("#MemorialTextHeading").val().trim(),
      Text: $("#MemorialText").val().trim()
    };
    console.log("==== updateMemText ====");
    console.log(updateMemText);
    $.ajax("/api/v1/memorial-text/", {
      type: "put",
      data: updateMemText
    }).then(
      function() {
        location.reload();
      }
    );
  });

});
