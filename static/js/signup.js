$(document).ready(() => {

  // Validate the password as soon as the fields are filled out.
  $("#PasswordConfirm").keyup(validatePassword);

  // When the signup button is clicked, we validate the email and password are not blank
  $("#signupForm").on("submit", function(e) {
    e.preventDefault();
    var newUser = {
      FirstName: $("#FirstName").val().trim(),
      LastName: $("#LastName").val().trim(),
      FlagNumber: 0,
      Email: $("#Email").val().trim().toLowerCase(),
      Password: $("#Password").val().trim(),
      Address1: $("#Address1").val().trim(),
      City: $("#City").val().trim(),
      State: $("#State").val().trim(),
      ZipCode: $("#ZipCode").val().trim()
    };

    // Post the new user
    $.ajax("/api/v1/newuser", {
      type: "POST",
      data: newUser
    }).then((res) => { 
        location.assign("/login"); 
    }).catch(err => {
      console.log("Something went wrong when creating the new user: " + err);
    })
  });

  // Functions
  function validatePassword() {
    const Password = $("#Password").val().trim();
    const PasswordConfirm = $("#PasswordConfirm").val().trim();

    if (Password !== PasswordConfirm) {
      $("#passwordValidationStatus").text("Passwords do not match. Please try again.").attr('style','color: red');
      $("#createUserButton").prop("disabled", true);
    } else {
      $("#passwordValidationStatus").text("Passwords match.").attr('style','color: green');
      $("#createUserButton").prop("disabled", false);
    }
  }

});
