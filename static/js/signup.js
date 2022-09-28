$(document).ready(() => {

  // When the signup button is clicked, we validate the email and password are not blank
  $("#signupForm").on("submit", function(e) {
    e.preventDefault();
    console.info("Signup Form Submitted");
    var newUser = {
      FirstName: $("#FirstName").val().trim(),
      LastName: $("#LastName").val().trim(),
      FlagNumber: 000,
      Email: $("#Email").val().trim(),
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

});
