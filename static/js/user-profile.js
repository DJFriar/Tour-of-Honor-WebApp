$(document).ready(() => {
  $('#riderSubmissionHistory').DataTable();

  // Save changes to user profile
  $("#saveProfileEdits").on("click", function() {
    let isAdmin = 0;
    if ($("#isAdmin").is(":checked")) { isAdmin = 1 };
    var UserID = $(this).data("userid");
    var updateUserProfile = {
      UserID,
      isAdmin: isAdmin,
      FirstName: $("#FirstName").val().trim(),
      LastName: $("#LastName").val().trim(),
      UserName: $("#UserName").val().trim(),
      FlagNumber: $("#FlagNumber").val().trim(),
      Email: $("#Email").val().trim(),
      ZipCode: $("#ZipCode").val().trim()
    }

    console.log("==== updateUserProfile ====");
    console.log(updateUserProfile);

    // Make sure that email field isn't blank.
    if (!updateUserProfile.Email) {
      handleLoginErr("Blank field detected.");
      return;
    }

    $.ajax("/api/v1/user", {
      type: "PUT",
      data: updateUserProfile
    }).then(
      function() { location.reload(); }
    );
  });

  // Handle Delete Submission
  $(".deleteSubmissionButton").on("click", function() {
    var id = $(this).data("uid");

    $.ajax("/handle-submission/" + id, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  });

  function handleLoginErr(err) {
    console.log(err);
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});