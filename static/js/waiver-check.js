$(document).ready(() => {
  const userid = $("#UserID").val().trim();

  // Check for Waiver by UserID
  function checkForWaiver(id) {
    console.log("checkForWaiver() called with user " + id);
    $.ajax("/api/v1/checkWaiverStatus/" + id, {
      type: "GET"
    }).then((res) => {
      console.log("==== checkWaiverStatus AJAX ====");
      console.log(res.body);
    }).catch(err => {
      console.log("Error when checking waiver status: " + err);
    });
  }

  setTimeout(checkForWaiver, 10000, userid);
});