$(document).ready(function () {
  var selectedFilter = "All";
  selectedFilter = localStorage.getItem("categoryFilter");
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

  // Handle Skip Button
  $(".skipButton").on("click", function() {
    var subID = $(this).data("submissionid");
    var scorerNotes = $("#scorerNotes").val().trim()
    var submissionInfo = {
      SubmissionID: subID,
      ScorerNotes: scorerNotes,
      Status: 3
    };

    $.ajax("/handle-submission", {
      type: "PUT",
      data: submissionInfo
    }).then(
      goToNextPendingSubmission(selectedFilter)
    );
  })

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

  // Handle POTM Button
  $(".potmButton").on("click", function() {
    var subID = $(this).data("submissionid");
    var potmInfo = {
      SubmissionID: subID
    };

    $.ajax("/handle-potmSubmission", {
      type: "PUT",
      data: potmInfo
    })
  });

  function goToNextPendingSubmission(category) {
    $.ajax("/api/v1/submission/" + category, {
      type: "GET"
    }).then(
      function(res) { 
        console.log("Going to submission " + res[0].id)
        location.assign("/submission/" + res[0].id); 
      }
    )
  }

  // function skipPendingSubmission(category, subID) {
  //   $.ajax("/api/v1/skipsubmission/" + category + "/" + subID, {
  //     type: "GET"
  //   }).then(
  //     function(res) { 
  //       console.log("Skipped " + subID + ". Going to submission " + res[0].id)
  //       location.assign("/submission/" + res[0].id); 
  //     }
  //   )
  // }
})