$(document).ready(function () {
  var selectedFilter = "All";
  selectedFilter = localStorage.getItem("categoryFilter");
  console.log("==== submission Detail Loaded ====");
  console.log("selectedFilter = " + selectedFilter);
  $("#selectFilterValue").text(selectedFilter);

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
      goToNextPendingSubmission(selectedFilter)
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
      goToNextPendingSubmission(selectedFilter)
    );
    
  });

  function goToNextPendingSubmission(category) {
    $.ajax("/api/v1/submission/" + category, {
      type: "GET"
    }).then(
      function(res) { 
        location.assign("/submission/" + res[0].id); 
      }
    )
  }
})