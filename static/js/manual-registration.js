/* eslint-disable no-restricted-globals */
$(document).ready(() => {
  let destinationFlagValid = false;
  // Handle Register Rider Button
  $('#registerRiderBtn').on('click', () => {
    const riderFirstName = $('#FirstName').val();
    const riderLastName = $('#LastName').val();
    const riderCellNumber = $('#CellNumber').val();
    const riderAddress1 = $('#Address1').val();
    const riderCity = $('#City').val();
    const riderState = $('#State').val();
    const riderZipCode = $('#ZipCode').val();
    const riderEmail = $('#Email').val();
    const riderPassword = $('#Password').val();
    const riderBikeYear = $('#BikeYear').val();
    const riderBikeMake = $('#BikeMake').val();
    const riderBikeModel = $('#BikeModel').val();
    const riderCharityChoice = $('#CharityChoice').val();
    const riderShirtSize = $('#RiderShirtSize').val();
    const riderShirtStyle = $('#RiderShirtStyle').val();
    const riderFlagNumber = $('#FlagNumber').val();
    const riderRegistration = {
      riderFirstName,
      riderLastName,
      riderCellNumber,
      riderAddress1,
      riderCity,
      riderState,
      riderZipCode,
      riderEmail,
      riderPassword,
      riderBikeYear,
      riderBikeMake,
      riderBikeModel,
      riderCharityChoice,
      riderShirtSize,
      riderShirtStyle,
      riderFlagNumber,
    };

    $.ajax('/api/v1/admin/register-new-rider', {
      type: 'POST',
      data: riderRegistration,
    }).then(() => {
      location.reload();
    });
  });

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

  // Character counter for Bike Model box
  $('#BikeModel, #EditBikeModel').keyup(function () {
    countChar(this);
  });

  // // Update shirt size dropown options when Rider's shirt is selected.
  // $('#RiderShirtStyle').change(() => {
  //   const selection = $('#RiderShirtStyle').val();

  //   if (selection !== 'Donation') {
  //     $('#RiderSizeNA').remove();
  //     $('#RiderShirtSize').prop('disabled', false);
  //     $('#RiderSizeXL').prop('selected', true);
  //   }

  //   if (selection === 'Donation') {
  //     if ($("#RiderShirtSize option[value='NA']").length === 0) {
  //       $('#RiderShirtSize').append(
  //         $('<option />').val('NA').attr('id', 'RiderSizeNA').prop('selected', true).html('N/A'),
  //       );
  //     }
  //     $('#RiderShirtSize').prop('disabled', true);
  //   }

  //   if (selection === 'Ladies V-Neck') {
  //     $('#RiderSizeLG').prop('selected', true);
  //     $('#RiderSize4X').remove();
  //     $('#RiderSize5X').remove();
  //   } else {
  //     if ($("#RiderShirtSize option[value='4X']").length === 0) {
  //       $('#RiderShirtSize').append($('<option />').val('4X').attr('id', 'RiderSize4X').html('4X'));
  //     }
  //     if ($("#RiderShirtSize option[value='5X']").length === 0) {
  //       $('#RiderShirtSize').append($('<option />').val('5X').attr('id', 'RiderSize5X').html('5X'));
  //     }
  //   }
  // });

  // Check New Flag Number Availability
  $('#FlagNumber').on('input paste', function () {
    $('#flagNumberAvailableCheck').addClass('hide-me');
    const flagNumber = $(this).val();
    if (flagNumber) {
      $.ajax(`/api/v1/riders/flag/${flagNumber}`, {
        type: 'GET',
      }).then((riderInfo) => {
        if (riderInfo.length > 0) {
          $('#flagNumberAvailableCheck')
            .text(`${riderInfo[0].FullName}`)
            .css('color', 'red')
            .removeClass('hide-me');
          destinationFlagValid = false;
          enableRiderRegistrationBtn();
        } else {
          $('#flagNumberAvailableCheck')
            .text('Flag Available')
            .css('color', 'green')
            .removeClass('hide-me');
          destinationFlagValid = true;
          enableRiderRegistrationBtn();
        }
      });
    }
  });

  function countChar(val) {
    const len = val.value.length;
    if (len >= 25) {
      // eslint-disable-next-line no-param-reassign
      val.value = val.value.substring(0, 25);
      $('.characterCount').text('Characters remaining: 0');
    } else {
      const remainder = 25 - len;
      $('.characterCount').text(`Characters remaining: ${remainder}`);
    }
  }

  function enableRiderRegistrationBtn() {
    if (destinationFlagValid) {
      $('#registerRiderBtn').attr('disabled', false);
    } else {
      $('#registerRiderBtn').attr('disabled', true);
    }
  }
});
