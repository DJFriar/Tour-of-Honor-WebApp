/* eslint-disable func-names */
$(document).ready(() => {
  let selectedFilter = 'All';
  selectedFilter = localStorage.getItem('categoryFilter');
  $('#selectFilterValue').text(selectedFilter);

  // Validate Scorer Notes before allowing Rejection
  $('#scorerNotes').on('input', () => {
    const scorerNotes = $('#scorerNotes').val().trim();
    if (scorerNotes.length >= 5) {
      $('.rejectButton').removeAttr('disabled');
      $('#rejectButtonSpan').removeAttr('uk-tooltip');
      $('.skipButton').removeAttr('disabled');
    } else {
      $('.rejectButton').attr('disabled', 'disabled');
      $('.skipButton').attr('disabled', 'disabled');
    }
  });

  // Handle Approve Button
  $('.approveButton').on('click', function () {
    const subID = $(this).data('submissionid');
    const scorerNotes = $('#scorerNotes').val().trim();
    const submitterID = $('#SubmissionUserID').val();
    const submittedMemorialID = $('#SubmissionMemorialID').val();
    const submittedFlagNumber = $('#SubmissionFlagNum').val();
    const submittedOtherRiders = $('#SubmissionOtherRiders').val();
    const submissionInfo = {
      SubmissionID: subID,
      ScorerNotes: scorerNotes,
      SubmittedMemorialID: submittedMemorialID,
      SubmittedUserID: submitterID,
      SubmittedFlagNumber: submittedFlagNumber,
      SubmittedOtherRiders: submittedOtherRiders,
      Status: 1,
    };

    $.ajax('/handle-submission', {
      type: 'PUT',
      data: submissionInfo,
    }).then(goToNextPendingSubmission(selectedFilter));
  });

  // Handle Skip Button
  $('.skipButton').on('click', function () {
    const subID = $(this).data('submissionid');
    const scorerNotes = $('#scorerNotes').val().trim();
    const submissionInfo = {
      SubmissionID: subID,
      ScorerNotes: scorerNotes,
      Status: 3,
    };

    $.ajax('/handle-submission', {
      type: 'PUT',
      data: submissionInfo,
    }).then(goToNextPendingSubmission(selectedFilter));
  });

  // Handle Reject Button
  $('.rejectButton').on('click', function () {
    const subID = $(this).data('submissionid');
    const scorerNotes = $('#scorerNotes').val().trim();
    const submissionInfo = {
      SubmissionID: subID,
      ScorerNotes: scorerNotes,
      Status: 2,
    };

    $.ajax('/handle-submission', {
      type: 'PUT',
      data: submissionInfo,
    }).then(goToNextPendingSubmission(selectedFilter));
  });

  // Handle POTM Button
  $('.potmButton').on('click', function () {
    const subID = $(this).data('submissionid');
    const potmInfo = {
      SubmissionID: subID,
    };

    $.ajax('/api/v1/email/potmSubmission', {
      type: 'PUT',
      data: potmInfo,
    });
  });

  function goToNextPendingSubmission(category) {
    $.ajax(`/api/v1/submission/${category}`, {
      type: 'GET',
    }).then((res) => {
      // eslint-disable-next-line no-restricted-globals
      location.assign(`/submission/${res[0].id}`);
    });
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
});
