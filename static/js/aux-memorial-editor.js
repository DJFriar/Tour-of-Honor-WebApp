  $(document).ready(function() {
    $('#auxMemorialTable').DataTable();

    // Handle add new memorial toggle
    $(".addMemorialButton").on("click", function(event) {
      event.preventDefault();
      $("#editMemorialInfo").toggleClass("hide-me");
      $(".addMemorialBtnDiv").toggleClass("hide-me");
    });
  });
