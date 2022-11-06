$(document).ready(() => {
  $('#sendResetLinkButton').on('click', () => {
    const passwordResetRequest = {
      Email: $('#Email').val().trim(),
    };

    $.ajax('/api/v1/email/resetpasswordrequest', {
      type: 'POST',
      data: passwordResetRequest,
    })
      .then(() => {
        toastr.success('Request Successful. Check your email for further instructions.', null, {
          closeButton: 'false',
          positionClass: 'toast-top-center',
          preventDuplicates: 'true',
          progressBar: 'false',
          timeOut: '0',
        });
      })
      .catch(handlePWResetError);
  });

  $('#resetPasswordButton').on('click', () => {
    const passwordResetAction = {
      Password: $('#Password').val().trim(),
      PasswordConfirm: $('#PasswordConfirm').val().trim(),
      UserID: $('#UserID').val().trim(),
    };

    if (!passwordResetAction.Password) {
      toastr.error('New Password field cannot be blank.', null, {
        closeButton: 'true',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
      return;
    }

    if (!passwordResetAction.PasswordConfirm) {
      toastr.error('Confirm New Password field cannot be blank.', null, {
        closeButton: 'true',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
      return;
    }

    // Make sure that the new passwords match.
    if (passwordResetAction.Password !== passwordResetAction.PasswordConfirm) {
      toastr.error(
        'Password mismatch. Please check that both fields contain the same password.',
        null,
        {
          closeButton: 'true',
          positionClass: 'toast-top-center',
          preventDuplicates: 'true',
          progressBar: 'true',
          timeOut: '2500',
        },
      );
    } else {
      $.ajax('/api/v1/email/resetpasswordaction', {
        type: 'PUT',
        data: passwordResetAction,
      })
        .then(() => {
          window.location.replace('/login');
        })
        .catch(handlePWResetError);
    }
  });

  function handlePWResetError() {
    toastr.error('An error was encountered. Please try again.', null, {
      closeButton: 'true',
      positionClass: 'toast-top-center',
      preventDuplicates: 'true',
      progressBar: 'true',
      timeOut: '2500',
    });
  }
});
