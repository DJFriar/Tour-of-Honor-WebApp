$(document).ready(function () {
  // Handle Approve Button
  $(".approveButton").on("click", function() {
    var subID = $(this).data("submissionid");
    var submissionInfo = {
      SubmissionID: subID,
      Status: 1
    };

    $.ajax("/handle-submission", {
      type: "PUT",
      data: submissionInfo
    }).then(
      function() { location.assign("/scoring"); }
    );
  });

  // Handle Reject Button
  $(".rejectConfirmation").on("click", function() {
    var subID = $(this).data("submissionid");
    var rejectionReason = $("#rejectNotes").val().trim()
    var submissionInfo = {
      SubmissionID: subID,
      Notes: rejectionReason,
      Status: 2
    };

    $.ajax("/handle-submission", {
      type: "PUT",
      data: submissionInfo
    }).then(
      function() { location.assign("/scoring"); }
    );
  });
})