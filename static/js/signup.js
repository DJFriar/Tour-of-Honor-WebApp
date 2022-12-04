$(document).ready(() => {
  // Validate the Email as soon as the fields are filled out.
  $('#EmailConfirm').keyup(validateEmail);

  // Validate the password as soon as the fields are filled out.
  $('#PasswordConfirm').keyup(validatePassword);

  // Format Cell Number field into (nnn) nnn-nnnn
  $('#CellNumber').on('input', (e) => {
    const $phoneField = e.target;
    const cursorPosition = $phoneField.selectionStart;
    const numericString = $phoneField.value.replace(/\D/g, '').substring(0, 10);

    // let user backspace over the '-'
    if (cursorPosition === 9 && numericString.length > 6) return;

    // let user backspace over the ') '
    if (cursorPosition === 5 && numericString.length > 3) return;
    if (cursorPosition === 4 && numericString.length > 3) return;

    const match = numericString.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      let newVal = `(${match[1]}`;
      newVal += match[2] ? `) ${match[2]}` : '';
      newVal += match[3] ? `-${match[3]}` : '';

      // to help us put the cursor back in the right place
      const delta = newVal.length - Math.min($phoneField.value.length, 14);
      $phoneField.value = newVal;
      $phoneField.selectionEnd = cursorPosition + delta;
    } else {
      $phoneField.value = '';
    }
  });

  // When the signup button is clicked, we validate the email and password are not blank
  $('#signupForm').on('submit', (e) => {
    e.preventDefault();
    const newUser = {
      FirstName: $('#FirstName').val().trim(),
      LastName: $('#LastName').val().trim(),
      FlagNumber: 0,
      Email: $('#Email').val().trim().toLowerCase(),
      Password: $('#Password').val().trim(),
      Address1: $('#Address1').val().trim(),
      City: $('#City').val().trim(),
      State: $('#State').val().trim(),
      ZipCode: $('#ZipCode').val().trim(),
      CellNumber: $('#CellNumber').val().trim(),
    };

    // Post the new user
    $.ajax('/api/v1/newuser', {
      type: 'POST',
      data: newUser,
    })
      .then((res) => {
        location.assign('/login');
      })
      .catch((err) => {
        toastr.options.onclick = function () {
          location.assign('/login');
        };
        toastr.error(
          'That email address is already in use. Click here to go to the login page.',
          null,
          {
            closeButton: 'true',
            positionClass: 'toast-top-center',
            preventDuplicates: 'true',
            progressBar: 'true',
            timeOut: '0',
          },
        );
      });
  });

  // Functions
  function validatePassword() {
    const Password = $('#Password').val().trim();
    const PasswordConfirm = $('#PasswordConfirm').val().trim();

    if (Password !== PasswordConfirm) {
      $('#passwordValidationStatus').removeClass('hide-me');
      $('#passwordValidationStatus')
        .text('Passwords do not match. Please try again.')
        .removeClass('labelValidationStatusSuccess')
        .addClass('labelValidationStatusFailed');
      $('#createUserButton').prop('disabled', true);
    } else {
      $('#passwordValidationStatus')
        .text('Passwords match.')
        .removeClass('labelValidationStatusFailed')
        .addClass('labelValidationStatusSuccess');
      $('#createUserButton').prop('disabled', false);
    }
  }

  function validateEmail() {
    const Email = $('#Email').val().trim();
    const EmailConfirm = $('#EmailConfirm').val().trim();

    if (Email !== EmailConfirm) {
      $('#emailValidationStatus').removeClass('hide-me');
      $('#emailValidationStatus')
        .text('Emails do not match. Please try again.')
        .removeClass('labelValidationStatusSuccess')
        .addClass('labelValidationStatusFailed');
      $('#createUserButton').prop('disabled', true);
    } else {
      $('#emailValidationStatus')
        .text('Emails match.')
        .removeClass('labelValidationStatusFailed')
        .addClass('labelValidationStatusSuccess');
      $('#createUserButton').prop('disabled', false);
    }
  }
});
