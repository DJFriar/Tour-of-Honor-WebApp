$(document).ready(function () {

  $("#scorerNotes").on("input", function () { 
    var scorerNotes = $("#scorerNotes").val().trim()
    if (scorerNotes.length >= 5) {
      $(".rejectButton").removeAttr("disabled");
      $("#rejectButtonSpan").removeAttr("uk-tooltip");
    } else {
      $(".rejectButton").attr("disabled", "disabled");      
    }
  });

  // Handle Approve Button
  $(".approveButton").on("click", function() {
    var subID = $(this).data("submissionid");
    var scorerNotes = $("#scorerNotes").val().trim();
    var submitterID = $("#SubmissionUserID").val();
    var submittedMemorialID = $("#SubmissionMemorialID").val();
    var submittedFlagNumber = $("#SubmissionFlagNum").val();
    var submittedOtherRiders = $("#SubmissionOtherRiders").val();
    var submissionInfo = {
      SubmissionID: subID,
      ScorerNotes: scorerNotes,
      SubmittedMemorialID: submittedMemorialID,
      SubmittedUserID: submitterID,
      SubmittedFlagNumber: submittedFlagNumber,
      SubmittedOtherRiders: submittedOtherRiders,
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
    var scorerNotes = $("#scorerNotes").val().trim()
    var submissionInfo = {
      SubmissionID: subID,
      ScorerNotes: scorerNotes,
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