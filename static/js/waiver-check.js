$(document).ready(() => {
  const userid = $("#UserID").val().trim();
  const activeUser = $("#activeUser").val().trim();
  const orderNumber = $("#OrderNumber").val().trim();

  checkAttempt = 1;
  console.log("==== waiver-check.js ====");
  console.log(userid + " / " + activeUser);

  if (orderNumber == "0") {
    setTimeout(() => {
      location.replace("/registration");
    }, 3000);
  }

  // Check for Waiver by UserID
  function checkForWaiver(id) {
    clearTimeout(timeoutID);
    console.log("checkForWaiver() called with user " + id + " / Attempt " + checkAttempt);
    $.ajax("/api/v1/checkWaiverStatus/" + id, {
      type: "GET"
    }).then((res) => {
      if (res) {
        if (activeUser === "true") {
          location.replace("/registration");
        } else {
          location.replace("/login");
        }
      }
      if (!res) {
        if (checkAttempt == 2) {
          $("#waiverFirstFailureText").addClass("hide-me");
          $("#waiverSecondFailureText").removeClass("hide-me");
          setTimeout(() => {
            if (activeUser === "true") {
              location.replace("/registration");
            } else {
              location.replace("/login");
            }
          }, 3000);
        }
        if (checkAttempt == 1) {
          $("#waiverFirstFailureText").removeClass("hide-me");
          checkAttempt++;
          timeoutID = setTimeout(() => {
            checkForWaiver(userid);
          }, 10000);
        }
      }
    }).catch(err => {
      console.log("Error when checking waiver status: " + err);
    });
  }

  let timeoutID = setTimeout(() => {
    checkForWaiver(userid);
  }, 10000);

});