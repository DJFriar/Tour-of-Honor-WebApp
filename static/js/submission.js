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
  $(".rejectButton").on("click", function() {
    var subID = $(this).data("submissionid");
    var submissionInfo = {
      SubmissionID: subID,
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