$(document).ready(() => {

  // Validate the Email as soon as the fields are filled out.
  $("#EmailConfirm").keyup(validateEmail);
  
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
      $("#passwordValidationStatus").removeClass("hide-me");
      $("#passwordValidationStatus")
        .text("Passwords do not match. Please try again.")
        .removeClass("labelValidationStatusSuccess")
        .addClass("labelValidationStatusFailed");
      $("#createUserButton").prop("disabled", true);
    } else {
      $("#passwordValidationStatus")
        .text("Passwords match.")
        .removeClass("labelValidationStatusFailed")
        .addClass("labelValidationStatusSuccess");
      $("#createUserButton").prop("disabled", false);
    }
  }

  function validateEmail() {
    const Email = $("#Email").val().trim();
    const EmailConfirm = $("#EmailConfirm").val().trim();

    if (Email !== EmailConfirm) {
      $("#emailValidationStatus").removeClass("hide-me");
      $("#emailValidationStatus")
        .text("Emails do not match. Please try again.")
        .removeClass("labelValidationStatusSuccess")
        .addClass("labelValidationStatusFailed");
      $("#createUserButton").prop("disabled", true);
    } else {
      $("#emailValidationStatus")
        .text("Emails match.")
        .removeClass("labelValidationStatusFailed")
        .addClass("labelValidationStatusSuccess");
      $("#createUserButton").prop("disabled", false);
    }
  }

});
