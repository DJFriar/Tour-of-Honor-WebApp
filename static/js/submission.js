$(document).ready(function () {

  $("#submissionNotes").on("input", function () { 
    var submissionNotes = $("#submissionNotes").val().trim()
    if (submissionNotes.length >= 5) {
      $(".rejectButton").removeAttr("disabled");
      $("#rejectButtonSpan").removeAttr("uk-tooltip");
    } else {
      $(".rejectButton").attr("disabled", "disabled");      
    }
  });

  // Handle Approve Button
  $(".approveButton").on("click", function() {
    var subID = $(this).data("submissionid");
    var submissionNotes = $("#submissionNotes").val().trim()
    var submissionInfo = {
      SubmissionID: subID,
      Notes: submissionNotes,
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
    var submissionNotes = $("#submissionNotes").val().trim()
    var submissionInfo = {
      SubmissionID: subID,
      Notes: submissionNotes,
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