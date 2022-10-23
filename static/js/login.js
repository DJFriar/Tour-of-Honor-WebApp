$(document).ready(() => {
  // Getting references to our form and inputs
  const loginForm = $("form.login");
  const emailInput = $("#UserEmail");
  const passwordInput = $("#UserPassword");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      Email: emailInput.val().trim(),
      Password: passwordInput.val().trim()
    };

    if (!userData.Email || !userData.Password) {
      console.log("Email and Password are required!");
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.Email, userData.Password);
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the profile page
  function loginUser(email, password) {
    $.post("/api/v1/login", {
      Email: email,
      Password: password
    }).then((res) => {
      if (res.isAdmin == 1) { 
        window.location.replace("/admin"); 
      } else if (res.isActive == 0) { 
        window.location.replace("/registration"); 
      } else { 
        window.location.replace("/memorials"); 
      }
    }).catch(err => {
      toastr.error("Invalid login. Please try again.", null, {"closeButton": "true", "positionClass": "toast-top-center", "preventDuplicates":"true", "progressBar": "true", "timeOut": "2500",  })
    });
  }
});
