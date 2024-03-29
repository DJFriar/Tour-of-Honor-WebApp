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
    } else {
      $('.rejectButton').attr('disabled', 'disabled');
    }
  });

  // Character counter for Scorer Notes
  $('#scorerNotes').keyup(function () {
    countChar(this);
  });

  // Handle Copy to Clipboard button
  $('.copyToClipboard').on('click', () => {
    // Grab the text field
    const copyText = document.getElementById('scorerNotes');
    // Get just the placeholder text
    const clipboardText = copyText.placeholder;
    // Make a fake textbox with the data we want as a value
    const clipboard = document.createElement('textarea');
    clipboard.style.height = 0;
    clipboard.style.width = 0;
    clipboard.value = clipboardText;
    document.body.appendChild(clipboard);
    // Select the new textbox and copy it to the clipboard
    clipboard.select();
    document.execCommand('copy');
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
    }).then(goToNextPendingSubmission(selectedFilter, subID));
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
    }).then(goToNextPendingSubmission(selectedFilter, subID));
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
    }).then(goToNextPendingSubmission(selectedFilter, subID));
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
    }).then(() => {
      $('.potmButton').attr('disabled', 'disabled');
    });
  });

  function goToNextPendingSubmission(category, subID) {
    $.ajax(`/api/v1/submission/${encodeURIComponent(category)}/${subID}`, {
      type: 'GET',
    }).then((res) => {
      // eslint-disable-next-line no-restricted-globals
      if (res[0].id === 0) {
        location.assign(`/scoring`);
      } else {
        location.assign(`/submission/${res[0].id}`);
      }
    });
  }

  function countChar(val) {
    const len = val.value.length;
    if (len >= 350) {
      // eslint-disable-next-line no-param-reassign
      val.value = val.value.substring(0, 350);
      $('.characterCount').text('Characters remaining: 0');
    } else {
      const remainder = 350 - len;
      $('.characterCount').text(`Characters remaining: ${remainder}`);
    }
  }
});
