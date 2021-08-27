  $(document).ready(function() {
    $('#auxMemorialTable').DataTable();

    // Handle add new memorial toggle
    $(".addMemorialButton").on("click", function(event) {
      event.preventDefault();
      $("#editMemorialInfo").toggleClass("hide-me");
      $(".addMemorialBtnDiv").toggleClass("hide-me");
    });

    // Handle Delete Memorial Button
    $(".deleteMemorialButton").on("click", function() {
      var id = $(this).data("uid");

      $.ajax("/api/v1/memorial/" + id, {
        type: "DELETE"
      }).then(
        function() {
          location.reload();
        }
      );
    });
  });
