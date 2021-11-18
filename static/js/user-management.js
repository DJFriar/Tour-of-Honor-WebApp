$(document).ready(function() {
  $('#usersTable').DataTable({
    pageLength: 100
  });
  $('#sponsorsTable').DataTable();

  $("#hasPassenger").change(function() {
    if (this.checked) {
      $(".PassengerInfoDiv").removeClass("hide-me")
      $("#PassengerFirstName").prop("required", true);
      $("#PassengerLastName").prop("required", true);
      $("#PassengerFlagNum").prop("required", true);
      $("#PassengerShirtStyle").prop("required", true);
      $("#PassengerShirtSize").prop("required", true);
    } else {
      $(".PassengerInfoDiv").addClass("hide-me")
      $("#PassengerFirstName").prop("required", false);
      $("#PassengerLastName").prop("required", false);
      $("#PassengerFlagNum").prop("required", false);
      $("#PassengerShirtStyle").prop("required", false);
      $("#PassengerShirtSize").prop("required", false);
    }
  });

  // Handle Edit User Button
  $(".editUserButton").on("click", function() {
    var id = $(this).data("uid");
    $(".modal").css("display","block");
    $.ajax("/api/v1/user/" + id, {
      type: "GET",
    }).then(
      function(res) {
        $("#EditUserID").val(res.id);
        $("#EditUserName").val(res.UserName);
        if (res.FlagNumber > 0) {
          $("#EditFlagNumber").val(res.FlagNumber);
        }
        $("#EditFirstName").val(res.FirstName);
        $("#EditLastName").val(res.LastName);
        $("#EditEmail").val(res.Email);
        $("#EditZipCode").val(res.ZipCode);
        if (res.isAdmin) {
          $("#isAdmin").prop("checked", true);
        } else {
          $("#isAdmin").prop("checked", false);
        }
      }
    )
  })

  // Handle Edit User Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Edit Dialog Cancel Button
  $("#cancelButton").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Save Changes Button
  $("#saveUserChangesButton").on("click", function() {
    var id = $("#EditUserID").val();
    var FlagNumber = 0;
    var isAdmin = false;

    if (parseInt($("#EditFlagNumber").val(),10) > 0) {
      FlagNumber = parseInt($("#EditFlagNumber").val(),10);
    }
    if ($("#isAdmin").prop("checked") == true) {
      isAdmin = true
    }
    
    var updateUser = {
      UserID: id,
      FlagNumber: FlagNumber,
      UserName: $("#EditUserName").val().trim(),
      FirstName: $("#EditFirstName").val().trim(),
      LastName: $("#EditLastName").val().trim(),
      Email: $("#EditEmail").val().trim(),
      ZipCode: $("#EditZipCode").val().trim(),
      isAdmin: isAdmin
    };
    $.ajax("/api/v1/user/", {
      type: "put",
      data: updateUser
    }).then(
      function() {
        location.reload();
      }
    );
  });

  // Handle Delete User Button
  $(".deleteUserButton").on("click", function() {
    var id = $(this).data("uid");
    $.ajax("/api/v1/user/" + id, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  });

  // Handle Rider Registration
  $("#createUserButton").on("click", function() {
    var randomUserName = randomString(8);
    var newUser = {
      FirstName: $("#FirstName").val().trim(),
      LastName: $("#LastName").val().trim(),
      Email: $("#Email").val().trim(),
      UserName: randomUserName,
      Password: randomString(14),
      FlagNumber: $("#FlagNum").val().trim()
    };

    var welcomeEmailInfo = {
      FirstName: $("#FirstName").val().trim(),
      Email: $("#Email").val().trim(),
      UserName: randomUserName,
      FlagNumber: $("#FlagNum").val().trim(),
      ShirtStyle: $("#ShirtStyle").val(),
      ShirtSize: $("#ShirtSize").val().trim(),
      PassengerFirstName: $("#PassengerFirstName").val().trim(),
      PassengerLastName: $("#PassengerLastName").val().trim(),
      PassengerEmail: "",
      PassengerUserName: randomUserName,
      PassengerFlagNumber: $("#PassengerFlagNum").val().trim(),
      PassengerShirtStyle: $("#PassengerShirtStyle").val(),
      PassengerShirtSize: $("#PassengerShirtSize").val().trim(),
      EmailNotes: $("#EmailNotes").val().trim()
    }

    // Make sure that rider first name isn't blank.
    if (!newUser.FirstName) {
      alert("Rider's First Name is required.");
      return;
    }

    // Make sure that rider last name isn't blank.
    if (!newUser.LastName) {
      alert("Rider's Last Name is required.");
      return;
    }

    // Make sure that rider email isn't blank.
    if (!newUser.Email) {
      alert("Rider's Email address is required.");
      return;
    }

    // Make sure that rider flag isn't blank.
    if (!newUser.FlagNumber) {
      alert("Rider's Flag Number is required.");
      return;
    }

    // Make sure that rider shirt size isn't blank.
    if (welcomeEmailInfo.ShirtStyle != "Donation") {
      if(!welcomeEmailInfo.ShirtSize) {
        alert("Rider's Shirt Size is required.");
        return;
      }
    }

    //Check Passenger Info
    if (hasPassenger) {
      // Make sure that passenger first name isn't blank.
      if (!welcomeEmailInfo.PassengerFirstName) {
        alert("Passenger's First Name is required.");
        return;
      }

      // Make sure that passenger last name isn't blank.
      if (!welcomeEmailInfo.PassengerLastName) {
        alert("Passenger's Last Name is required.");
        return;
      }

      // Make sure that passenger email isn't blank.
      // if (!welcomeEmailInfo.PassengerEmail) {
      //   alert("Passenger's Email address is required.");
      //   return;
      // }

      // Make sure that passenger flag isn't blank.
      if (!welcomeEmailInfo.PassengerFlagNumber) {
        alert("Passenger's Flag Number is required.");
        return;
      }

      // Make sure that passenger shirt size isn't blank.
      if (welcomeEmailInfo.PassengerShirtStyle != "Donation") {
        if(!welcomeEmailInfo.PassengerShirtSize) {
          alert("Passenger's Shirt Size is required.");
          return;
        }
      }
    }

    // If shirt is donated, set a false value for ShirtSize
    if (welcomeEmailInfo.ShirtStyle == "Donation") {
      welcomeEmailInfo.ShirtSize = "Donated";
    }
    if (welcomeEmailInfo.PassengerShirtStyle == "Donation") {
      welcomeEmailInfo.PassengerShirtSize = "Donated";
    }

    // Create the new rider
    $.ajax("/api/v1/user", {
      type: "POST",
      data: newUser
    })
      .then(() => {
        console.log("Rider Profile Added");
        sendWelcomeEmail();
      })
      .catch(handleRegistrationError);

    function sendWelcomeEmail() {
      // Send the user a welcome email.
      $.ajax("/api/v1/welcomeemail", {
        type: "POST",
        data: welcomeEmailInfo
      })
        .then(() => {
          window.location.reload();
        })
        .catch(handleRegistrationError);
    }
  })

  function handleRegistrationError(err) {
    console.log(err.responseJSON.errors[0].message);
    alert(err.responseJSON.errors[0].message);
    return;
  }

});

const randomString = (length = 14) => {
  return Math.random().toString(16).substr(2, length);
};