$(document).ready(() => {
  $("#sendResetLinkButton").on("click", function() {
    var passwordResetRequest = {
      Email: $("#Email").val().trim()
    };

    $.ajax("/api/v1/resetpasswordrequest", {
      type: "POST",
      data: passwordResetRequest
    })
      .then(() => {
        window.location.reload();
      })
      .catch(handlePWResetError);
  });

  $("#resetPasswordButton").on("click", function() {
    var passwordResetAction = {
      Password: $("#Password").val().trim(),
      PasswordConfirm: $("#PasswordConfirm").val().trim(),
      UserID: $("#UserID").val().trim()
    };

    // Make sure that the new passwords match.
    if (passwordResetAction.Password != passwordResetAction.PasswordConfirm) {
      alert("Password mismatch. Please check that both fields contain the same password.");
      return;
    } else {
      $.ajax("/api/v1/resetpasswordaction", {
        type: "PUT",
        data: passwordResetAction
      })
        .then(() => {
          window.location.replace("/login");
        })
        .catch(handlePWResetError);
    }
  })

  function handlePWResetError(err) {
    console.log(err);
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
