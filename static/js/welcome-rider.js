$(document).ready(() => {

  // When the signup button is clicked, we validate the email and password are not blank
  $("#updateNewRiderButton").on("click", function() {
    console.log("New Rider Profile Update Button Clicked");
    var updateRider = {
      UserName: $("#UserName").val().trim(),
      City: $("#City").val().trim(),
      State: $("#State").val().trim(),
      ZipCode: $("#ZipCode").val().trim(),
      Password: $("#Password").val().trim(),
      PasswordConfirm: $("#PasswordConfirm").val().trim(),
      BikeYear: $("#BikeYear").val().trim(),
      BikeMake: $("#BikeMake").val().trim(),
      BikeModel: $("#BikeModel").val().trim(),
      UserID: $("#UserID").val().trim()
    };

    // Make sure that username isn't blank.
    if (!updateRider.UserName) {
      alert("User Name is required.");
      return;
    }

    // Make sure that zip code isn't blank.
    if (!updateRider.ZipCode) {
      alert("Zip Code is required.");
      return;
    }

    // Make sure that city isn't blank.
    if (!updateRider.City) {
      alert("City is required.");
      return;
    }

    // Make sure that state isn't blank.
    if (!updateRider.State) {
      alert("State is required.");
      return;
    }

    // Make sure that bike year isn't blank.
    if (!updateRider.BikeYear) {
      alert("Bike year is required.");
      return;
    }

    // Make sure that bike make isn't blank.
    if (!updateRider.BikeMake) {
      alert("Bike make is required.");
      return;
    }

    // Make sure that bike model isn't blank.
    if (!updateRider.BikeModel) {
      alert("Bike Model is required.");
      return;
    }

    // Make sure that the new passwords match.
    if (updateRider.Password != updateRider.PasswordConfirm) {
      alert("Password mismatch. Please check that both fields contain the same password.");
      return;
    }

    // Update the user's profile
    $.ajax("/api/v1/rideronboarding", {
      type: "PUT",
      data: updateRider
    })
      .then(() => {
        $.ajax("/api/v1/bike", {
          type: "POST",
          data: updateRider
        })
          .then(() => {
            window.location.replace("/login");
          })
          .catch(handleWelcomeRiderError);
      })
  });

  function handleWelcomeRiderError(err) {
    console.log(err.responseJSON.errors[0].message);
    alert(err.responseJSON.errors[0].message);
    return;
  }
});
