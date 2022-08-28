$(document).ready(function() {
  var ShopifyVariantID = "";
  var CheckoutURL = "";

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
    }
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: orderInfo
    }).then(() => { UIkit.switcher("#registrationSwitcher").show(1); }
    )
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

  // Handle Set Address Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Set Address Dialog Cancel Button
  $("#cancelButton").on("click", function() {
    $(".modal").css("display","none");
  })

  // ************************
  // ** Bike Info Tab **
  // ************************


  // ************************
  // ** Passenger Info Tab **
  // ************************

  // Handle Has Passenger No button
  $("#registerPassengerNo").on("click", function() {
    var UserID = $(this).data("userid");
    $("#registerPassengerNo").addClass("uk-button-primary").removeClass("uk-button-secondary");
    $("#registerPassengerYes").addClass("uk-button-secondary").removeClass("uk-button-primary");
    $("#passengerInfoSection").addClass("hide-me");
    $("#passengerInfoForm").addClass("hide-me");
    $("#passengerFlagLookup").addClass("hide-me");
    $("#passengerFlagLookupResults").addClass("hide-me");

    var PassOrderInfo = {
      RegStep: "Passenger",
      UserID,
      PassUserID: 0
    }
    console.log(PassOrderInfo);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: PassOrderInfo
    }).then(() => { 
      UIkit.switcher("#registrationSwitcher").show(3);
      $("#saveTshirtInfo").attr("data-showpassoptions", "false");
    })
  })

  // Handle Has Passenger Yes button
  $("#registerPassengerYes").on("click", function() {
    $("#registerPassengerYes").addClass("uk-button-primary").removeClass("uk-button-secondary");
    $("#registerPassengerNo").addClass("uk-button-secondary").removeClass("uk-button-primary");
    $("#passengerAlreadyHasFlagNo").addClass("uk-button-primary").removeClass("uk-button-secondary");
    $("#passengerAlreadyHasFlagYes").addClass("uk-button-primary").removeClass("uk-button-secondary");
    $("#passengerInfoSection").removeClass("hide-me");
  })

  // Handle Passenger Doesn't Have Flag Button
  $("#passengerAlreadyHasFlagNo").on("click", function() {
    $("#passengerAlreadyHasFlagNo").addClass("uk-button-primary").removeClass("uk-button-secondary");
    $("#passengerAlreadyHasFlagYes").addClass("uk-button-secondary").removeClass("uk-button-primary");
    $("#passengerInfoForm").removeClass("hide-me");
    $("#passengerFlagLookup").addClass("hide-me");
  })

  // Handle Passenger Already Has Flag Button
  $("#passengerAlreadyHasFlagYes").on("click", function() {
    $("#passengerAlreadyHasFlagYes").addClass("uk-button-primary").removeClass("uk-button-secondary");
    $("#passengerAlreadyHasFlagNo").addClass("uk-button-secondary").removeClass("uk-button-primary");
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
        if(res.id == UserID) {
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
      RegStep: "Passenger",
      UserID,
      PassUserID
    }
    console.log(PassOrderInfo);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: PassOrderInfo
    }).then(() => { 
      UIkit.switcher("#registrationSwitcher").show(3);
      $("#passengerShirtSection").removeClass("hide-me");
      $("#saveTshirtInfo").attr("data-showpassoptions", "true");
    })
  })

  // Handle Save Passenger Info Button
  $("#savePassengerInfo").on("click", function() {
    UIkit.switcher("#registrationSwitcher").show(3);
  })

  // ************************
  // ** T-Shirt Choice Tab **
  // ************************

  // Handle Save T-Shirt Choices Button
  $("#saveTshirtInfo").on("click", function() {
    var UserID = $(this).data("userid");
    var showPass = $(this).data("showpassoptions");

    var ShirtOrderInfo = {
      RegStep: "Shirts",
      UserID,
      hasPass: false,
      ShirtStyle: $("#RiderShirtStyle").val(),
      ShirtSize: $("#RiderShirtSize").val()
    }
    if(showPass) {
      ShirtOrderInfo.hasPass = true;
      ShirtOrderInfo.PassShirtStyle = $("#PassengerShirtStyle").val();
      ShirtOrderInfo.PassShirtSize = $("#PassengerShirtSize").val();
    }
    console.log(ShirtOrderInfo);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: ShirtOrderInfo
    }).then(function(res) {
      CheckoutURL = res.checkoutURL;
      $("#goToPayment").attr("data-pricetier", res.PriceTier);
      $("#totalCostAmount").text(res.totalPrice);
      UIkit.switcher("#registrationSwitcher").show(3);
    })
  })

  // **********************
  // ** Payment Info Tab **
  // **********************

  // Handle Rider Payment Button
  $("#goToPayment").on("click", function() {
    window.open(CheckoutURL);
    $("#shopifyPaymentContainer").addClass("hide-me");
    $("#awaitingShopifyContent").removeClass("hide-me");
  })

  $("#goToWaiver").on("click", function() {
    UIkit.switcher("#registrationSwitcher").show(6);
  })

  // *********************
  // ** Waiver Info Tab **
  // *********************

  // Handle Waiver Button
  $("#saveWaiverInfo").on("click", function() {
    var UserID = $(this).data("userid");
    var WaiverInfo = {
      RegStep: "Waiver",
      UserID
    }
    console.log(WaiverInfo);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: WaiverInfo
    }).then(() => { UIkit.switcher("#registrationSwitcher").show(7); }
    )
  })

  // **************************
  // ** Flag Number Info Tab **
  // **************************

  // Handle Waiver Button
  $("#saveFlagNumberInfo").on("click", function() {
    var UserID = $(this).data("userid");
    var FlagNumberInfo = {
      RegStep: "Waiver",
      UserID
    }
    console.log(FlagNumberInfo);
    $.ajax("/api/v1/regFlow", {
      type: "POST",
      data: FlagNumberInfo
    }).then(() => { UIkit.switcher("#registrationSwitcher").show(8); }
    )
  })
});
