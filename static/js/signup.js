$(document).ready(() => {

  // When the signup button is clicked, we validate the email and password are not blank
  $("#createUserButton").on("click", function() {
    console.log("Create User Button Clicked");
    var newUser = {
      FirstName: $("#FirstName").val().trim(),
      LastName: $("#LastName").val().trim(),
      UserName: $("#UserName").val().trim(),
      Email: $("#Email").val().trim(),
      Password: $("#Password").val().trim()
    };

    // Make sure that neither email nor password are blank.
    if (!newUser.Email || !newUser.Password) {
      handleSignupError("Blank field detected.");
      return;
    }
    // If we have an email and password, then post the new user
    $.ajax("/api/v1/user", {
      type: "POST",
      data: newUser
    })
      .then(() => {
        window.location.replace("/user-profile");
      })
      .catch(handleSignupError);
  });

  function handleSignupError(err) {
    console.log(err);
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
