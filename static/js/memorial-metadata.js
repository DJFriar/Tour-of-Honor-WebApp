$(document).ready(function() {
  $('#memorialMetadataTable').DataTable({
    pageLength: 50
  });
  $('#restrictionsTable').DataTable();
  $('#categoryTable').DataTable();

  // Handle add new memorial data toggle
  $(".addMemorialDataButton").on("click", function(e) {
    e.preventDefault();
    $(".modal").css("display","block");
    // $("#editMemorialInfo").toggleClass("hide-me");
    // $(".addMemorialDataButton").toggleClass("hide-me");
  });

  // Handle Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Dialog Cancel Button
  $("#cancelButton").on("click", function() {
    $(".modal").css("display","none");
  })
});