$(document).ready(function() {
  var riderReady = false;
  var passReady = false;
  var enableWhen = "";
  var CheckoutURL = $("#checkoutUrl").data("checkouturl");
  var activeTab = $("#registrationSwitcher").attr("active");
  var nextStepNum = $("#nextStepNum").data("nextstepnum");
  for (let i = 0; i <= nextStepNum; i++) {
    $("#RegStep" + i).removeClass("disabled");
  }
  
  // ************************
  // ** Rider Info Tab (0) **
  // ************************

  // Handle Address Needs Updating button
  $("#addressIsCorrectNo").on("click", function() {
    $(".modal").css("display","block");
  })

  // Handle Address Confirmed button
  $("#addressIsCorrectYes").on("click", function() {
    var UserID = $(this).data("userid");
    var orderInfo = {
      RegStep: "Rider",
      RallyYear: 2023,
      UserID,
      NextStepNum: 1
    }
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: orderInfo
    }).then(() => { 
      $("#RegStep1").removeClass("disabled");
      UIkit.switcher("#registrationSwitcher").show(1); 
    })
  })

  // Handle setAddress button
  $("#setAddressButton").on("click", function() {
    $(".modal").css("display","block");
  })

  // Handle Smarty Autocomplete


  // Handle saveNewAddressBtn
  $("#saveNewAddressBtn").on("click", function(e) {
    e.preventDefault();
    var UserID = $(this).data("userid");
    var saveAddress = {
      UserID,
      Address1: $("#newAddress").val().trim()
    }
    $.ajax("/api/v1/saveAddress", {
      type: "PUT",
      data: saveAddress,
    }).then(
      function() { location.replace("/logout"); }
    )
  })

  // ***********************
  // ** Bike Info Tab (1) **
  // ***********************

  // Handle Add New Bike Button
  $("#addNewBikeBtn").on("click", function(e) {
    e.preventDefault();
    $("#bikeInfoAddModal").css("display","block");
  })

  // Handle Save New Bike Button
  $("#saveNewBikeInfoBtn").on("click", function(e) {
    e.preventDefault();
    var UserID = $(this).data("userid");

    var bikeInfo = {
      UserID,
      BikeYear: $("#BikeYear").val().trim(),
      BikeMake: $("#BikeMake").val().trim(),
      BikeModel: $("#BikeModel").val().trim(),
    }

    $.ajax("/api/v1/bike", {
      type: "POST",
      data: bikeInfo
    }).then(
      function() { location.reload(); }
    )
  })

  // Handle Edit Bike Info Button
  $(".editBikeInfoBtn").on("click", function(e) {
    e.preventDefault();
    console.log("editBikeInfoBtn clicked");
    var BikeID = $(this).data("bikeid");

    $.ajax("/api/v1/bike/"+ BikeID, {
      type: "GET",
    }).then(
      function(res) {
        $("#bikeInfoEditModal").css("display","block");
        $("#EditBikeID").val(res.id);
        $("#EditBikeYear").val(res.Year);
        $("#EditBikeMake").val(res.Make);
        $("#EditBikeModel").val(res.Model);
      }
    )
  })

  // Handle Save Edited Bike Info button
  $("#saveEditedBikeInfoBtn").on("click", function(e) {
    e.preventDefault();
    var editedBikeInfo = {
      BikeID: $("#EditBikeID").val().trim(),
      BikeYear: $("#EditBikeYear").val().trim(),
      BikeMake: $("#EditBikeMake").val().trim(),
      BikeModel: $("#EditBikeModel").val().trim(),
    }

    $.ajax("/api/v1/bike", {
      type: "PUT",
      data: editedBikeInfo
    }).then(
      function() { location.reload(); }
    )
  })

  // Handle Bike Deletion
  $(".deleteBikeBtn").on("click", function(e) {
    e.preventDefault();
    var BikeID = $(this).data("bikeid");

    $.ajax("/api/v1/bike/" + BikeID, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  })

  // Handle Bike Info Accurate Button
  $("#acceptBikeInfoBtn").on("click", function(e) {
    e.preventDefault();
    var UserID = $(this).data("userid");
    var BikeInfo = {
      RegStep: "Bike",
      UserID,
      NextStepNum: 2
    }
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: BikeInfo
    }).then(() => { 
      $("#RegStep2").removeClass("disabled");
      UIkit.switcher("#registrationSwitcher").show(2); 
    })
  })

  // ****************************
  // ** Passenger Info Tab (2) **
  // ****************************

  // Handle Has Passenger No button
  $("#registerPassengerNo").on("click", function() {
    var UserID = $(this).data("userid");
    $("#registerPassengerNo").addClass("uk-button-primary").removeClass("uk-button-default");
    $("#registerPassengerYes").addClass("uk-button-default").removeClass("uk-button-primary");
    $("#passengerInfoSection").addClass("hide-me");
    $("#passengerInfoForm").addClass("hide-me");
    $("#passengerFlagLookup").addClass("hide-me");
    $("#passengerFlagLookupResults").addClass("hide-me");

    var PassOrderInfo = {
      RegStep: "NoPassenger",
      UserID,
      PassUserID: 0,
      NextStepNum: 3
    }
    console.log(PassOrderInfo);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: PassOrderInfo
    }).then(() => { 
      $("#RegStep3").removeClass("disabled");
      UIkit.switcher("#registrationSwitcher").show(3);
    })
  })

  // Handle Has Passenger Yes button
  $("#registerPassengerYes").on("click", function() {
    $("#registerPassengerYes").addClass("uk-button-primary").removeClass("uk-button-default");
    $("#registerPassengerNo").addClass("uk-button-default").removeClass("uk-button-primary");
    $("#passengerAlreadyHasFlagNo").addClass("uk-button-primary").removeClass("uk-button-default");
    $("#passengerAlreadyHasFlagYes").addClass("uk-button-primary").removeClass("uk-button-default");
    $("#passengerInfoSection").removeClass("hide-me");
  })

  // Handle Passenger Doesn't Have Flag Button
  $("#passengerAlreadyHasFlagNo").on("click", function() {
    $("#passengerAlreadyHasFlagNo").addClass("uk-button-primary").removeClass("uk-button-default");
    $("#passengerAlreadyHasFlagYes").addClass("uk-button-default").removeClass("uk-button-primary");
    $("#passengerInfoForm").removeClass("hide-me");
    $("#passengerFlagLookup").addClass("hide-me");
  })

  // Handle Passenger Already Has Flag Button
  $("#passengerAlreadyHasFlagYes").on("click", function() {
    $("#passengerAlreadyHasFlagYes").addClass("uk-button-primary").removeClass("uk-button-default");
    $("#passengerAlreadyHasFlagNo").addClass("uk-button-default").removeClass("uk-button-primary");
    $("#passengerFlagLookup").removeClass("hide-me");
    $("#passengerInfoForm").addClass("hide-me");
  })
  
  // Handle Lookup Passenger Info Button
  $("#lookupPassengerFlag").on("click", function() {
    $("#passengerFlagLookupResultsError").addClass("hide-me");
    var UserID = $(this).data("userid");
    var flag = $("#PassengerFlagNumber").val().trim();
    $.ajax("/api/v1/lookupRiderByFlag/" + flag, {
      type: "GET",
    }).then(
      function(res) {
        if(res === null) {
          $("#passengerFlagLookupResults").addClass("hide-me");
          $("#passengerFlagLookupResultsError").removeClass("hide-me");
          $("#errorMessage").text("You have entered an invalid flag number. Please try again.");
        } 
        if(res.id == UserID) {
          $("#passengerFlagLookupResults").addClass("hide-me");
          $("#passengerFlagLookupResultsError").removeClass("hide-me");
          $("#errorMessage").text("You entered your own flag number. Please try again.");
        } else {
          $("#passengerFlagLookupResults").removeClass("hide-me");
          $("#acceptPassengerFlagMatch").attr("data-passuserid", res.id);
          $("#PassengerFirstName").text("#" + res.FlagNumber + " " + res.FirstName);
          $("#PassengerLastName").text(res.LastName);
        }
      }
    )
  })

  // Handle Accept Passenger Lookup Info
  $("#acceptPassengerFlagMatch").on("click", function() {
    var UserID = $(this).data("userid");
    var PassUserID = $(this).data("passuserid");
    var PassOrderInfo = {
      RegStep: "ExistingPassenger",
      UserID,
      PassUserID,
      NextStepNum: 3
    }
    console.log(PassOrderInfo);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: PassOrderInfo
    }).then(() => { 
      $("#RegStep3").removeClass("disabled");
      UIkit.switcher("#registrationSwitcher").show(3);
    })
  })

  // Validate the passenger's email as soon as the fields are filled out.
  $("#PassengerEmailFormConfirm").keyup(validateEmail);

  // Validate the passenger's password as soon as the fields are filled out.
  $("#PassengerPasswordConfirmForm").keyup(validatePassword);

  // Check Passenger Email Uniqueness
  $("#PassengerEmailForm").focusout(function() {
    var email = $(this).val();
    if (email) {
      $.ajax("/api/v1/email/" + email, {
        type: "GET"
      }).then(
        function(emailInfo) {
          if (emailInfo) {
            existingPassengerEmailFound = true;
            $("#PassengerEmailForm").css("border","4px solid red")
            $("#emailValidationError").text("Email address must be unique. Please use a different email.");
            $("#savePassengerInfo").prop("disabled", true);
          } else {
            existingPassengerEmailFound = false;
            $("#PassengerEmailForm").css("border","none")
            $("#emailValidationError").text("");
            $("#savePassengerInfo").prop("disabled", false);
          }
        }
      );
    }
  })

  // Handle Save Passenger Info Button
  $("#savePassengerInfo").on("click", function() {
    const UserID = $(this).data("userid");

    var PassengerInfo = {
      RegStep: "NewPassenger",
      UserID,
      NextStepNum: 3,
      FirstName: $("#PassengerFirstNameForm").val().trim(),
      LastName: $("#PassengerLastNameForm").val().trim(),
      Email: $("#PassengerEmailForm").val().trim().toLowerCase(),
      Password: $("#PassengerPasswordForm").val().trim(),
      FlagNumber: 0
    }

    // Make sure that Passenger first name isn't blank.
    if (!PassengerInfo.FirstName) {
      $("#PassengerFirstNameForm").css("border","4px solid red");
      alert("Passenger's First Name is required.");
      return;
    }

    // Make sure that Passenger last name isn't blank.
    if (!PassengerInfo.LastName) {
      $("#PassengerLastNameForm").css("border","4px solid red");
      alert("Passenger's Last Name is required.");
      return;
    }

    // Make sure that Passenger email isn't blank.
    if (!PassengerInfo.Email) {
      $("#PassengerEmailForm").css("border","4px solid red");
      alert("Passenger's Email address is required.");
      return;
    }

    // Make sure that Passenger password isn't blank.
    if (!PassengerInfo.Password) {
      $("#PassengerUserNameForm").css("border","4px solid red");
      alert("Passenger's Password is required.");
      return;
    }

    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: PassengerInfo,
      statusCode: {
        409: function() {
          $("#PassengerEmailForm").css("border","4px solid red");
          alert("Passenger's Email Address must be unique.");
          $("#savePassengerInfo").prop("disabled", true);
        }
      }
    }).then(
      function() { location.reload(); }
    )
  })

  // ****************************
  // ** Charity Choice Tab (3) **
  // ****************************

  // Handle Charity Choice Button
  $("#saveCharityChoiceBtn").on("click", function(e) {
    e.preventDefault();
    const UserID = $(this).data("userid");
    const charityChoice = $("#CharityChoice").val().trim();

    var CharityChoices = {
      RegStep: "Charity",
      UserID,
      CharityChoice: charityChoice,
      NextStepNum: 4
    }
    console.log(CharityChoices);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: CharityChoices
    }).then(
      function() { location.reload(); }
    )
  })

  // ****************************
  // ** T-Shirt Choice Tab (4) **
  // ****************************

  // Handle Save T-Shirt Choices Button
  $("#saveTshirtInfo").on("click", function(e) {
    e.preventDefault();
    const UserID = $(this).data("userid");
    const submittedPassID = $(this).data("passid");

    var ShirtOrderInfo = {
      RegStep: "Shirts",
      UserID,
      hasPass: false,
      NextStepNum: 5,
      ShirtStyle: $("#RiderShirtStyle").val(),
      ShirtSize: $("#RiderShirtSize").val()
    }
    if(submittedPassID > 0) {
      ShirtOrderInfo.hasPass = true;
      ShirtOrderInfo.PassShirtStyle = $("#PassengerShirtStyle").val();
      ShirtOrderInfo.PassShirtSize = $("#PassengerShirtSize").val();
    }

    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: ShirtOrderInfo
    }).then(() => {
      location.replace("/registration");
    })
  })

  // **************************
  // ** Payment Info Tab (5) **
  // **************************

  // Handle Rider Payment Button
  $("#goToPayment").on("click", function() {
    window.open(CheckoutURL);
    $("#shopifyPaymentContainer").addClass("hide-me");
    $("#awaitingShopifyContent").removeClass("hide-me");
  })

  $("#goToPayment2, #goToPayment3").on("click", function() {
    window.open(CheckoutURL);
  })

  $(".checkForOrderNumber").on("click", function() {
    var UserID = $(this).data("userid");

    $.ajax("/api/v1/checkOrderStatus/" + UserID, {
      type: "GET"
    }).then((res) => {
      if (res > 0) {
        location.reload();
      } else {
        $(".noOrderFoundText").removeClass("hide-me");
      }
    })
  })

  $(".goToWaiverButton").on("click", function() {
    var UserID = $(this).data("userid");

    $.ajax("/api/v1/checkOrderStatus/" + UserID, {
      type: "GET"
    }).then((res) => {
      if (res > 0) {
        $("#RegStep6").removeClass("disabled");
        UIkit.switcher("#registrationSwitcher").show(6); 
      } else {
        $("#awaitingShopifyContent").addClass("hide-me");
        $("#orderNumberMissing").removeClass("hide-me");
      }
    })
  })

  $("#goToWaiver2").on("click", function() {
    var UserID = $(this).data("userid");
    $.ajax("/api/v1/checkOrderStatus/" + UserID, {
      type: "GET"
    }).then((res) => {
      if (res > 0) {
        $("#RegStep6").removeClass("disabled");
        UIkit.switcher("#registrationSwitcher").show(6); 
      } else {
        console.log("Unable to confirm successful payment.");
      }
    })
  })

  // *************************
  // ** Waiver Info Tab (6) **
  // *************************

  // Handle Waiver Button
  $(".signWaiverButton").on("click", function(e) {
    e.preventDefault();
    var UserID = $(this).data("userid");
    const waiverURL = "https://waiver.smartwaiver.com/v/tohDev/?auto_anyoneelseneedtosign=0&auto_tag=" + UserID;
    var WaiverInfo = {
      RegStep: "Waiver",
      UserID,
      NextStepNum: 7
    }
    console.log(WaiverInfo);
    window.open(waiverURL);
  })

  // Handle Continue to Flag Number bUtton
  $(".goToFlagNumber").on("click", function(e) {
    e.preventDefault();
    var OrderID = $(this).data("orderid");

    var WaiverInfo = {
      RegStep: "Waiver",
      OrderID,
      NextStepNum: 7
    }
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: WaiverInfo
    }).then(() => {
      location.replace("/registration");
    })
  })

  // ******************************
  // ** Flag Number Info Tab (7) **
  // ******************************

  // Handle Keep Existing Flag Yes button
  $(".keepExistingFlagNum").on("click", function(e) {
    e.preventDefault();
    const UserID = $(this).data("userid");
    const OrderID = $(this).data("orderid");
    const whoami = $(this).data("whoami");
    const enableWhen = $(this).data("enablewhen");
    const ExistingFlagNum = $(this).data("existingflagnumber");

    var FlagNumberInfo = {
      RallyYear: 2023,
      UserID,
      FlagNumber: ExistingFlagNum,
    }

    var OrderUpdateInfo = {
      RegStep: "FlagInProgess",
      whoami,
      RallyYear: 2023,
      UserID,
      OrderID,
      RequestedFlagNumber: ExistingFlagNum,
    }

    // Update the Flag table to assign the flag to the user.
    console.log(FlagNumberInfo);
    $.ajax("/api/v1/flag", {
      type: "POST",
      data: FlagNumberInfo,
    }).then(() => {
      $.ajax("/api/v1/regFlow", {
        type: "POST",
        data: OrderUpdateInfo
      }).then(() => {
        if (whoami === "rider") {
          riderReady = true;
          $("#flagAssignedRider").removeClass("hide-me");
        }
        if (whoami === "passenger") {
          passReady = true;
          $("#flagAssignedPassenger").removeClass("hide-me");
        }
      }).catch(err => {
        console.log("Error when updating Order Info: " + err);
      })
    }).catch(err => {
      console.log("Error when saving existing Flag Assignment: " + err);
    });

    if (enableWhen === "rider" && riderReady) { 
      $("#goToSummaryBtn").prop("disabled", false) 
    }
    if (enableWhen === "pass" && (riderReady && passReady)) {
      $("#goToSummaryBtn").prop("disabled", false) 
    }

  })

  // Handle Keep Existing Flag No button for Rider
  $(".chooseAnotherFlagNum").on("click", function(e) {
    e.preventDefault();
    var UserID = $(this).data("userid");
    var whoami = $(this).data("whoami");
    $("#chooseFlagNumberModal").css("display","block");
    $("#saveNewFlagNumChoiceBtn").attr("data-userid", UserID);
    $("#saveNewFlagNumChoiceBtn").attr("data-whoami", whoami);
  })

  // Handle generateRandomFlagNumber Button
  $("#generateRandomFlagNumber").on("click", function(e) {
    e.preventDefault();
    $.ajax("/api/v1/randomAvailableFlag", {
      type: "GET"
    }).then((flagNumber) => {
      $("#RequestedFlagNumber").val(flagNumber);
      $("#flagAvailabilityResponse").text("This flag number is available.").css("color","green").removeClass("hide-me");
      $("#saveNewFlagNumChoiceBtn").prop("disabled",false);
    })
  })

  // Handle getNextAvailableFlagNumber Button
  $("#getNextAvailableFlagNumber").on("click", function(e) {
    e.preventDefault();
    $.ajax("/api/v1/nextAvailableFlag", {
      type: "GET"
    }).then((flagNumber) => {
      $("#RequestedFlagNumber").val(flagNumber);
      $("#flagAvailabilityResponse").text("This flag number is available.").css("color","green").removeClass("hide-me");
      $("#saveNewFlagNumChoiceBtn").prop("disabled",false);
    })
  })

  // Handle Check Flag Availability button
  $("#checkFlagNumberAvailability").on("click", function(e) {
    e.preventDefault();
    var requestedFlagNumber = $("#RequestedFlagNumber").val().trim();

    $.ajax("/api/v1/flag/" + requestedFlagNumber, {
      type: "GET"
    }).then(
      function(flagInfo) {
        if (flagInfo) {
          $("#flagAvailabilityResponse").text("This flag number is not available.").css("color","red").removeClass("hide-me");
          $("#saveNewFlagNumChoiceBtn").prop("disabled",true);
        } else {
          $("#flagAvailabilityResponse").text("This flag number is available.").css("color","green").removeClass("hide-me");
          $("#saveNewFlagNumChoiceBtn").prop("disabled",false);
        }
      }
    );
  })

  // Handle Save New Flag Button
  $("#saveNewFlagNumChoiceBtn").on("click", function(e) {
    e.preventDefault();
    const UserID = $(this).data("userid");
    const whoami = $(this).data("whoami");
    enableWhen = $(this).data("enablewhen");
    const requestedFlagNumber = $("#RequestedFlagNumber").val().trim();

    var FlagNumberInfo = {
      RallyYear: 2023,
      UserID,
      FlagNumber: requestedFlagNumber,
    }

    $.ajax("/api/v1/flag", {
      type: "POST",
      data: FlagNumberInfo
    }).then(() => {
      if (whoami === "rider") {
        riderReady = true;
        $("#flagAssignedRider").removeClass("hide-me");
      }
      if (whoami === "passenger") {
        passReady = true;
        $("#flagAssignedPassenger").removeClass("hide-me");
      }
    }).catch(err => {
      console.log("Error when saving new Flag Assignment: " + err);
    });

  })

  // Handle Continue to Summary Button
  $("#goToSummaryBtn").on("click", function(e) {
    e.preventDefault();
    var UserID = $(this).data("userid");

    var FlagInfoCompleted = {
      RegStep: "FlagComplete",
      UserID,
      NextStepNum: 8
    }
    console.log(FlagInfoCompleted);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: FlagInfoCompleted
    }).then(() => {
      $("#RegStep8").removeClass("disabled");
      UIkit.switcher("#registrationSwitcher").show(8); 
    })

  })

  // ************************
  // ** Misc Support Items **
  // ************************

  // Handle Dialog Close & Cancel Buttons
  $(".close, #cancelButton").on("click", function(e) {
    e.preventDefault();
    $(".modal").css("display","none");
  })

  // Monitor for Continue to Summary Button to be enabled
  if (enableWhen === "rider" && riderReady) { 
    $("#goToSummaryBtn").prop("disabled", false) 
  }
  if (enableWhen === "pass" && (riderReady && passReady)) {
    $("#goToSummaryBtn").prop("disabled", false) 
  }

  // Generate random passsword for new users
  const randomString = (length = 14) => {
    return Math.random().toString(16).substr(2, length);
  };

  // Check for Waiver by UserID
  function checkForWaiver(id) {
    $.ajax("/api/v1/checkWaiverStatus", {
      type: "GET",
      data: {
        UserID: id,
      }
    }).then(() => {
      if (whoami === "rider") {
        riderReady = true;
        $("#flagAssignedRider").removeClass("hide-me");
      }
      if (whoami === "passenger") {
        passReady = true;
        $("#flagAssignedPassenger").removeClass("hide-me");
      }
    }).catch(err => {
      console.log("Error when saving new Flag Assignment: " + err);
    });
  }

  // Password validation
  function validatePassword() {
    const Password = $("#PassengerPasswordForm").val().trim();
    const PasswordConfirm = $("#PassengerPasswordConfirmForm").val().trim();

    if (Password !== PasswordConfirm) {
      $("#passwordValidationStatus").removeClass("hide-me");
      $("#passwordValidationStatus")
        .text("Passwords do not match, please try again.")
        .removeClass("labelValidationStatusSuccess")
        .addClass("labelValidationStatusFailed");
      $("#savePassengerInfo").prop("disabled", true);
    } else {
      $("#passwordValidationStatus")
        .text("Passwords match.")
        .removeClass("labelValidationStatusFailed")
        .addClass("labelValidationStatusSuccess");
      $("#savePassengerInfo").prop("disabled", false);
    }
  }

  // Email validation
  function validateEmail() {
    const Email = $("#PassengerEmailForm").val().trim();
    const EmailConfirm = $("#PassengerEmailFormConfirm").val().trim();

    if (Email !== EmailConfirm) {
      $("#emailValidationStatus").removeClass("hide-me");
      $("#emailValidationStatus")
        .text("Emails do not match, please try again.")
        .removeClass("labelValidationStatusSuccess")
        .addClass("labelValidationStatusFailed");
      $("#savePassengerInfo").prop("disabled", true);
    } else {
      $("#emailValidationStatus")
        .text("Emails match.")
        .removeClass("labelValidationStatusFailed")
        .addClass("labelValidationStatusSuccess");
      $("#savePassengerInfo").prop("disabled", false);
    }
  }
});
