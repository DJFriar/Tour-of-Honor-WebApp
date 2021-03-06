$(document).ready(() => {
  $('#riderSubmissionHistory').DataTable({
    "order": [[ 3, "desc" ]],
    "pageLength": 25
  });

  $('#riderBikeInfo').DataTable({
    "order": [[ 3, "desc" ]],
    "pageLength": 25
  });

  // Save changes to user profile
  $("#saveProfileEdits").on("click", function() {
    var UserID = $(this).data("userid");
    var PillionFlagNumberInput = $("#PillionFlagNumber").val().trim();
    if (!PillionFlagNumberInput || PillionFlagNumberInput == "N/A") {
      PillionFlagNumberInput = 0;
    }

    var updateUserProfile = {
      UserID,
      FirstName: $("#FirstName").val().trim(),
      LastName: $("#LastName").val().trim(),
      UserName: $("#UserName").val().trim(),
      FlagNumber: $("#FlagNumber").val().trim(),
      PillionFlagNumber: PillionFlagNumberInput,
      Email: $("#Email").val().trim(),
      City: $("#City").val().trim(),
      State: $("#State").val().trim(),
      ZipCode: $("#ZipCode").val().trim()
    }

    // Make sure that email field isn't blank.
    if (!updateUserProfile.Email) {
      handleLoginErr("Blank field detected.");
      return;
    }

    // 

    $.ajax("/api/v1/user", {
      type: "PUT",
      data: updateUserProfile
    }).then(
      function() { location.replace("/logout"); }
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

  // Handle Reset Password Button
  $("#resetPasswordLink").on("click", function() {
    window.location.replace("/forgotpassword");
  });

  function handleLoginErr(err) {
    console.log(err);
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});