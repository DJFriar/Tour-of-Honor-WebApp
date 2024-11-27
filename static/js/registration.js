/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

/**
 * static/js/registration.js
 *
 * @description:: Support file for Registration process.
 *
 */

// LINK - views/pages/registration.ejs

$(document).ready(() => {
  const riderReady = false;
  const passReady = false;
  let enableWhen = '';
  const CheckoutURL = $('#checkoutUrl').data('checkouturl');
  const FlagSurcharge = $('#flagSurcharge').data('flagsurcharge');
  const FlagSurchargeCheckoutURL = $('#flagSurchargeCheckoutUrl').data('flagcheckouturl');
  const nextStepNum = $('#nextStepNum').data('nextstepnum');
  for (let i = 0; i <= nextStepNum; i++) {
    $(`#RegStep${i}`).removeClass('disabled');
  }

  // ************************
  // ** Rider Info Tab (0) **
  // ************************
  /* #region  Rider Info Tab */

  // LINK - views/partials/regFlow/riderInfo.ejs

  // Handle Address Needs Updating button
  $('#addressIsCorrectNo').on('click', () => {
    $('#setAddressModal').css('display', 'block');
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

  // Handle Address Confirmed button
  $('#addressIsCorrectYes').on('click', function addressIsCorrectYes() {
    const UserID = $(this).data('userid');
    const orderInfo = {
      RegStep: 'Rider',
      RallyYear: 2025,
      UserID,
      NextStepNum: 1,
    };
    $.ajax('/api/v1/regFlow', {
      type: 'POST',
      data: orderInfo,
    }).then(() => {
      $('#RegStep1').removeClass('disabled');
      UIkit.switcher('#registrationSwitcher').show(1);
    });
  });

  // Handle setAddress button
  $('#setAddressButton').on('click', () => {
    $('.modal').css('display', 'block');
  });

  // Handle saveNewAddressBtn
  $('#saveNewAddressBtn').on('click', function saveNewAddressBtn(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');
    const saveAddress = {
      UserID,
      Address1: $('#Address1').val().trim(),
      City: $('#City').val().trim(),
      State: $('#State').val().trim(),
      ZipCode: $('#ZipCode').val().trim(),
      Email: $('#Email').val().trim(),
      CellNumber: $('#CellNumber').val().trim(),
      TimeZone: $('#TimeZone').val().trim(),
    };
    $.ajax('/api/v1/saveAddress', {
      type: 'PUT',
      data: saveAddress,
    }).then(() => {
      location.reload();
    });
  });

  /* #endregion */

  // ***********************
  // ** Vehicle Info Tab (1) **
  // ***********************
  /* #region  Vehicle Info Tab */

  // LINK - views/partials/regFlow/vehicleInfo.ejs

  // Handle Add New Bike Button
  $('#addNewBikeBtn').on('click', (e) => {
    e.preventDefault();
    $('#bikeInfoAddModal').css('display', 'block');
  });

  // Handle Save New Bike Button
  $('#saveNewBikeInfoBtn').on('click', function saveNewBikeInfoBtn(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');

    const bikeInfo = {
      UserID,
      BikeYear: $('#BikeYear').val().trim(),
      BikeMake: $('#BikeMake').val().trim(),
      BikeModel: $('#BikeModel').val().trim(),
    };

    $.ajax('/api/v1/bike', {
      type: 'POST',
      data: bikeInfo,
    }).then(() => {
      location.reload();
    });
  });

  // Handle Save New Auto Button
  $('#saveNewAutoBtn').on('click', function saveNewAutoBtn(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');
    const automobileInfo = {
      UserID,
      BikeYear: '0000',
      BikeMake: '99',
      BikeModel: 'Automobile',
    };

    $.ajax('/api/v1/bike', {
      type: 'POST',
      data: automobileInfo,
    }).then(() => {
      const AutoInfo = {
        RegStep: 'Bike',
        UserID,
        NextStepNum: 2,
      };

      $.ajax('/api/v1/regFlow', {
        type: 'POST',
        data: AutoInfo,
      }).then(() => {
        $('#RegStep2').removeClass('disabled');
        UIkit.switcher('#registrationSwitcher').show(2);
      });
    });
  });

  // Handle Edit Bike Info Button
  $('.editBikeInfoBtn').on('click', function editBikeInfoBtn(e) {
    e.preventDefault();
    const BikeID = $(this).data('bikeid');

    $.ajax(`/api/v1/bike/${BikeID}`, {
      type: 'GET',
    }).then((res) => {
      $('#bikeInfoEditModal').css('display', 'block');
      $('#EditBikeID').val(res.id);
      $('#EditBikeYear').val(res.Year);
      $('#EditBikeMake').val(res.Make);
      $('#EditBikeModel').val(res.Model);
    });
  });

  // Handle Save Edited Bike Info button
  $('#saveEditedBikeInfoBtn').on('click', (e) => {
    e.preventDefault();
    const editedBikeInfo = {
      BikeID: $('#EditBikeID').val().trim(),
      BikeYear: $('#EditBikeYear').val().trim(),
      BikeMake: $('#EditBikeMake').val().trim(),
      BikeModel: $('#EditBikeModel').val().trim(),
    };

    $.ajax('/api/v1/bike', {
      type: 'PUT',
      data: editedBikeInfo,
    }).then(() => {
      location.reload();
    });
  });

  // Handle Bike Deletion
  $('.deleteBikeBtn').on('click', function deleteBikeBtn(e) {
    e.preventDefault();
    const BikeID = $(this).data('bikeid');

    $.ajax(`/api/v1/bike/${BikeID}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });

  // Handle Switch to Automobile Button
  $('#changeToAutomobileBtn').on('click', function covertToAutomobile(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');

    $.ajax(`/api/v1/bike/convert/${UserID}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });

  // Handle Bike Info Accurate Button
  $('#acceptBikeInfoBtn').on('click', function acceptBikeInfoBtn(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');
    const BikeInfo = {
      RegStep: 'Bike',
      UserID,
      NextStepNum: 2,
    };
    $.ajax('/api/v1/regFlow', {
      type: 'POST',
      data: BikeInfo,
    }).then(() => {
      $('#RegStep2').removeClass('disabled');
      UIkit.switcher('#registrationSwitcher').show(2);
    });
  });

  /* #endregion */

  // ****************************
  // ** Passenger Info Tab (2) **
  // ****************************
  /* #region  Passenger Info Tab */

  // LINK - views/partials/regFlow/passengerInfo.ejs

  // Handle Has Passenger No button
  $('#registerPassengerNo').on('click', function registerPassengerNo() {
    const UserID = $(this).data('userid');
    $('#registerPassengerNo').addClass('uk-button-primary').removeClass('uk-button-default');
    $('#registerPassengerYes').addClass('uk-button-default').removeClass('uk-button-primary');
    $('#passengerInfoSection').addClass('hide-me');
    $('#passengerInfoForm').addClass('hide-me');
    $('#passengerFlagLookup').addClass('hide-me');
    $('#passengerFlagLookupResults').addClass('hide-me');

    const PassOrderInfo = {
      RegStep: 'NoPassenger',
      UserID,
      PassUserID: 0,
      NextStepNum: 3,
    };

    $.ajax('/api/v1/regFlow', {
      type: 'POST',
      data: PassOrderInfo,
    }).then(() => {
      $('#RegStep3').removeClass('disabled');
      UIkit.switcher('#registrationSwitcher').show(3);
    });
  });

  // Handle Has Passenger Yes button
  $('#registerPassengerYes').on('click', () => {
    $('#registerPassengerYes').addClass('uk-button-primary').removeClass('uk-button-default');
    $('#registerPassengerNo').addClass('uk-button-default').removeClass('uk-button-primary');
    $('#passengerAlreadyHasFlagNo').addClass('uk-button-primary').removeClass('uk-button-default');
    $('#passengerAlreadyHasFlagYes').addClass('uk-button-primary').removeClass('uk-button-default');
    $('#passengerInfoSection').removeClass('hide-me');
  });

  // Handle Passenger Doesn't Have Flag Button
  $('#passengerAlreadyHasFlagNo').on('click', () => {
    $('#passengerAlreadyHasFlagNo').addClass('uk-button-primary').removeClass('uk-button-default');
    $('#passengerAlreadyHasFlagYes').addClass('uk-button-default').removeClass('uk-button-primary');
    $('#passengerInfoForm').removeClass('hide-me');
    $('#passengerFlagLookup').addClass('hide-me');
  });

  // Handle Passenger Already Has Flag Button
  $('#passengerAlreadyHasFlagYes').on('click', () => {
    $('#passengerAlreadyHasFlagYes').addClass('uk-button-primary').removeClass('uk-button-default');
    $('#passengerAlreadyHasFlagNo').addClass('uk-button-default').removeClass('uk-button-primary');
    $('#passengerFlagLookup').removeClass('hide-me');
    $('#passengerInfoForm').addClass('hide-me');
  });

  // Handle Lookup Passenger Info Button
  $('#lookupPassengerFlag').on('click', function lookupPassengerFlag() {
    $('#passengerFlagLookupResultsError').addClass('hide-me');
    $('#passengerFlagLookupResults').addClass('hide-me');
    const UserID = $(this).data('userid');
    const flag = $('#PassengerFlagNumber').val().trim();
    $.ajax(`/api/v1/lookupPassInfoByFlag/${flag}`, {
      type: 'GET',
    }).then((res) => {
      if (res.FirstName === null) {
        $('#passengerFlagLookupResults').addClass('hide-me');
        $('#passengerFlagLookupResultsError').removeClass('hide-me');
        $('#errorMessage').text('You have entered an invalid flag number. Please try again.');
      }
      if (res.id === UserID) {
        $('#passengerFlagLookupResults').addClass('hide-me');
        $('#passengerFlagLookupResultsError').removeClass('hide-me');
        $('#errorMessage').text('You entered your own flag number. Please try again.');
      }
      if (res.id && res.id !== UserID) {
        $('#passengerFlagLookupResults').removeClass('hide-me');
        $('#acceptPassengerFlagMatch').attr('data-passuserid', res.id);
        $('#PassengerFirstName').text(`#${flag} ${res.FirstName}`);
        $('#PassengerLastName').text(res.LastName);
      }
    });
  });

  // Handle Accept Passenger Lookup Info
  $('#acceptPassengerFlagMatch').on('click', function acceptPassengerFlagMatch() {
    const UserID = $(this).data('userid');
    const PassUserID = $(this).data('passuserid');
    const PassOrderInfo = {
      RegStep: 'ExistingPassenger',
      UserID,
      PassUserID,
      NextStepNum: 3,
    };

    $.ajax('/api/v1/regFlow', {
      type: 'POST',
      data: PassOrderInfo,
    }).then(() => {
      $('#RegStep3').removeClass('disabled');
      UIkit.switcher('#registrationSwitcher').show(3);
    });
  });

  // Validate the passenger's email as soon as the fields are filled out.
  $('#PassengerEmailFormConfirm').keyup(validateEmail);

  // Validate the passenger's password as soon as the fields are filled out.
  $('#PassengerPasswordConfirmForm').keyup(validatePassword);

  // Check Passenger Email Uniqueness
  $('#PassengerEmailForm').focusout(function PassengerEmailForm() {
    const email = $(this).val();
    if (email) {
      $.ajax(`/api/v1/email/${email}`, {
        type: 'GET',
      }).then((emailInfo) => {
        if (emailInfo) {
          existingPassengerEmailFound = true;
          $('#PassengerEmailForm').css('border', '4px solid red');
          $('#emailValidationError').text(
            'Email address must be unique. Please use a different email.',
          );
          $('#savePassengerInfo').prop('disabled', true);
        } else {
          existingPassengerEmailFound = false;
          $('#PassengerEmailForm').css('border', 'none');
          $('#emailValidationError').text('');
          $('#savePassengerInfo').prop('disabled', false);
        }
      });
    }
  });

  // Handle Save Passenger Info Button
  $('#savePassengerInfo').on('click', function savePassengerInfo() {
    const UserID = $(this).data('userid');

    const PassengerInfo = {
      RegStep: 'NewPassenger',
      UserID,
      NextStepNum: 3,
      FirstName: $('#PassengerFirstNameForm').val().trim(),
      LastName: $('#PassengerLastNameForm').val().trim(),
      Email: $('#PassengerEmailForm').val().trim().toLowerCase(),
      Password: $('#PassengerPasswordForm').val().trim(),
      FlagNumber: 0,
    };

    // Make sure that Passenger first name isn't blank.
    if (!PassengerInfo.FirstName) {
      $('#PassengerFirstNameForm').css('border', '4px solid red');
      alert("Passenger's First Name is required.");
      return;
    }

    // Make sure that Passenger last name isn't blank.
    if (!PassengerInfo.LastName) {
      $('#PassengerLastNameForm').css('border', '4px solid red');
      alert("Passenger's Last Name is required.");
      return;
    }

    // Make sure that Passenger email isn't blank.
    if (!PassengerInfo.Email) {
      $('#PassengerEmailForm').css('border', '4px solid red');
      alert("Passenger's Email address is required.");
      return;
    }

    // Make sure that Passenger password isn't blank.
    if (!PassengerInfo.Password) {
      $('#PassengerUserNameForm').css('border', '4px solid red');
      alert("Passenger's Password is required.");
      return;
    }

    $.ajax('/api/v1/regFlow', {
      type: 'POST',
      data: PassengerInfo,
      statusCode: {
        409() {
          $('#PassengerEmailForm').css('border', '4px solid red');
          alert("Passenger's Email Address must be unique.");
          $('#savePassengerInfo').prop('disabled', true);
        },
      },
    }).then(() => {
      location.reload();
    });
  });

  /* #endregion */

  // ****************************
  // ** Charity Choice Tab (3) **
  // ****************************
  /* #region  Charity Choice Tab */

  // LINK - views/partials/regFlow/charityChoice.ejs

  // Enabled the Button when a choice is made
  $('#CharityChoice').on('change', () => {
    $('#saveCharityChoiceBtn').removeAttr('disabled');
  });

  // Handle Charity Choice Button
  $('#saveCharityChoiceBtn').on('click', function saveCharityChoiceBtn(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');
    const charityChoice = $('#CharityChoice').val().trim();

    const CharityChoices = {
      RegStep: 'Charity',
      UserID,
      CharityChoice: charityChoice,
      NextStepNum: 4,
    };

    $.ajax('/api/v1/regFlow', {
      type: 'POST',
      data: CharityChoices,
    }).then(() => {
      location.reload();
    });
  });

  /* #endregion */

  // ****************************
  // ** T-Shirt Choice Tab (X) **
  // ****************************
  /* #region  T-Shirt Choice Tab */

  // LINK - views/partials/regFlow/t-shirt.ejs

  // Handle Save T-Shirt Choices Button
  $('#saveTshirtInfo').on('click', function saveTshirtInfo(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');

    const ShirtOrderInfo = {
      RegStep: 'Shirts',
      UserID,
      hasPass: false,
      NextStepNum: 5,
      ShirtStyle: $('#RiderShirtStyle').val(),
      ShirtSize: $('#RiderShirtSize').val(),
    };
    if (submittedPassID > 0) {
      ShirtOrderInfo.hasPass = true;
      ShirtOrderInfo.PassShirtStyle = $('#PassengerShirtStyle').val();
      ShirtOrderInfo.PassShirtSize = $('#PassengerShirtSize').val();
    }

    $.ajax('/api/v1/regFlow', {
      beforeSend() {
        $('.modal').css('display', 'none');
        $('.spinnerBox').removeClass('hide-me');
      },
      complete() {
        $('.spinnerBox').addClass('hide-me');
      },
      type: 'POST',
      data: ShirtOrderInfo,
    }).then(() => {
      location.replace('/registration');
    });
  });

  /* #endregion */

  // *************************
  // ** Waiver Info Tab (4) **
  // *************************
  /* #region  Waiver Info Tab */

  // LINK - views/partials/regFlow/waiver.ejs

  // Handle Waiver Button
  $('.signWaiverButton').on('click', function signWaiverButton(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');
    const WaiverName = $(this).data('waivername');
    const waiverURL = `https://waiver.smartwaiver.com/v/${WaiverName}/?auto_anyoneelseneedtosign=0&auto_tag=${UserID}`;
    window.open(waiverURL);
  });

  // Handle Continue to Payment Button
  $('.goToPaymentStep').on('click', function goToPaymentStep(e) {
    e.preventDefault();
    const OrderID = $(this).data('orderid');
    const submittedPassID = $(this).data('passid');

    const WaiverInfo = {
      RegStep: 'Waiver',
      OrderID,
      hasPass: false,
      NextStepNum: 5,
    };

    if (submittedPassID > 0) {
      WaiverInfo.hasPass = true;
    }

    $.ajax('/api/v1/regFlow', {
      type: 'POST',
      data: WaiverInfo,
    }).then(() => {
      location.replace('/registration');
    });
  });

  /* #endregion */

  // **************************
  // ** Payment Info Tab (5) **
  // **************************
  /* #region  Payment Info Tab */

  // LINK - views/partials/regFlow/payment.ejs

  // Handle Rider Payment Button
  $('#goToPayment').on('click', (e) => {
    e.preventDefault();
    $('#shopifyWarningModal').css('display', 'block');
  });

  // Handle Checkout Now Button
  $('#goToShopifyPaymentBtn').on('click', () => {
    window.open(CheckoutURL);
    $('#shopifyWarningModal').css('display', 'none');
    $('#shopifyPaymentContainer').addClass('hide-me');
    $('#awaitingShopifyContent').removeClass('hide-me');
  });

  $('#goToPayment2, #goToPayment3').on('click', () => {
    window.open(CheckoutURL);
  });

  $('.checkForOrderNumber').on('click', function checkForOr() {
    const UserID = $(this).data('userid');

    $.ajax(`/api/v1/orders/checkOrderStatus/${UserID}`, {
      type: 'GET',
    }).then((res) => {
      if (res > 0) {
        location.reload();
      } else {
        $('.noOrderFoundText').removeClass('hide-me');
      }
    });
  });

  $('.goToFlagNumberButton').on('click', function goToFlagNumberButton() {
    const UserID = $(this).data('userid');

    $.ajax(`/api/v1/orders/checkOrderStatus/${UserID}`, {
      type: 'GET',
    }).then((res) => {
      if (res > 0) {
        $('#RegStep7').removeClass('disabled');
        UIkit.switcher('#registrationSwitcher').show(6);
      } else {
        $('#awaitingShopifyContent').addClass('hide-me');
        $('#orderNumberMissing').removeClass('hide-me');
      }
    });
  });

  $('#goToSummaryAutoBtn').on('click', function goToSummaryButton() {
    const UserID = $(this).data('userid');
    const OrderID = $(this).data('orderid');
    const whoami = $(this).data('whoami');

    $.ajax(`/api/v1/orders/checkOrderStatus/${UserID}`, {
      type: 'GET',
    }).then((res) => {
      if (res > 0) {
        $.ajax(`/api/v1/flag/nextAvailableAuto`, {
          type: 'GET',
        })
          .then((flagNumber) => {
            if (flagNumber > 0) {
              console.log(`==== flagNumber assigned is ${flagNumber} ====`);

              const OrderUpdateInfo = {
                RegStep: 'FlagInProgress',
                whoami,
                RallyYear: 2025,
                UserID,
                OrderID,
                RequestedFlagNumber: flagNumber,
              };

              console.log(`==== OrderUpdateInfo object contains: ====`, OrderUpdateInfo);

              $.ajax(`/api/v1/regFlow`, {
                beforeSend() {
                  $('.spinnerBox').removeClass('hide-me');
                },
                complete() {
                  $('.spinnerBox').addClass('hide-me');
                },
                type: 'POST',
                data: OrderUpdateInfo,
              })
                .then(() => {
                  const OrderFinishedInfo = {
                    RegStep: 'FlagComplete',
                    OrderID,
                    NextStepNum: 8,
                  };

                  $.ajax(`/api/v1/regFlow`, {
                    beforeSend() {
                      $('.spinnerBox').removeClass('hide-me');
                    },
                    complete() {
                      $('.spinnerBox').addClass('hide-me');
                    },
                    type: 'POST',
                    data: OrderFinishedInfo,
                  })
                    .then(() => {
                      location.reload();
                    })
                    .catch(() => {
                      showToastrError('An error occured while loading your summary.');
                    });
                })
                .catch(() => {
                  showToastrError('An error occured while assigning your flag number.');
                });
            }
          })
          .catch(() => {
            showToastrError('An error occured while reserving a flag number for you.');
          });
      } else {
        $('#awaitingShopifyContent').addClass('hide-me');
        $('#orderNumberMissing').removeClass('hide-me');
      }
    });
  });

  $('#goToWaiver2').on('click', function goToWaiver2() {
    const UserID = $(this).data('userid');
    $.ajax(`/api/v1/orders/checkOrderStatus/${UserID}`, {
      type: 'GET',
    }).then((res) => {
      if (res > 0) {
        $('#RegStep7').removeClass('disabled');
        UIkit.switcher('#registrationSwitcher').show(6);
      } else {
        showToastrError('Unable to confirm payment.');
      }
    });
  });

  /* #endregion */

  // ******************************
  // ** Flag Number Info Tab (6) **
  // ******************************
  /* #region  Flag Number Info Tab */

  // LINK - views/partials/regFlow/flagNumber.ejs

  // Handle Keep Existing Flag Yes button
  $('.keepExistingFlagNum').on('click', function keepExistingFlagNum(e) {
    e.preventDefault();

    const UserID = $(this).data('userid');
    const OrderID = $(this).data('orderid');
    const whoami = $(this).data('whoami');
    const ExistingFlagNum = $(this).data('existingflagnumber');

    const OrderUpdateInfo = {
      RegStep: 'FlagInProgress',
      whoami,
      RallyYear: 2025,
      UserID,
      OrderID,
      RequestedFlagNumber: ExistingFlagNum,
    };

    $.ajax('/api/v1/regFlow', {
      beforeSend() {
        $('.spinnerBox').removeClass('hide-me');
      },
      complete() {
        $('.spinnerBox').addClass('hide-me');
      },
      type: 'POST',
      data: OrderUpdateInfo,
    })
      .then(() => {
        location.reload();
      })
      .catch(() => {
        showToastrError('An error occured while reserving your existing flag.');
      });
  });

  // Handle Keep Existing Flag No button for Rider
  $('.chooseFlagNum').on('click', function chooseFlagNum(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');
    const whoami = $(this).data('whoami');
    const OrderID = $(this).data('orderid');
    $('#chooseFlagNumberModal').css('display', 'block');
    $('#saveNewFlagNumChoiceBtn').attr('data-userid', UserID);
    $('#saveNewFlagNumChoiceBtn').attr('data-whoami', whoami);
    $('#saveNewFlagNumChoiceBtn').attr('data-orderid', OrderID);
  });

  // Handle generateRandomFlagNumber Button
  $('#generateRandomFlagNumber').on('click', (e) => {
    e.preventDefault();
    $.ajax('/api/v1/randomAvailableFlag', {
      type: 'GET',
    }).then((flagNumber) => {
      $('#RequestedFlagNumber').val(flagNumber);
      $('#flagAvailabilityResponse')
        .text('This flag number is available.')
        .css('color', 'green')
        .removeClass('hide-me');
      $('#saveNewFlagNumChoiceBtn').prop('disabled', false);
    });
  });

  // Handle getNextAvailableFlagNumber Button
  $('#getNextAvailableFlagNumber').on('click', (e) => {
    e.preventDefault();
    $.ajax('/api/v1/flag/nextAvailable', {
      type: 'GET',
    }).then((flagNumber) => {
      if (flagNumber > 0) {
        $('#RequestedFlagNumber').val(flagNumber);
        $('#flagAvailabilityResponse')
          .text(`Flag #${flagNumber} is available.`)
          .css('color', 'green')
          .removeClass('hide-me');
        $('#saveNewFlagNumChoiceBtn').prop('disabled', false);
      } else {
        $('#flagAvailabilityResponse')
          .text('An error occurred, please try again.')
          .css('color', 'red');
      }
    });
  });

  // Handle Check Flag Availability button
  $('#checkFlagNumberAvailability').on('click', (e) => {
    e.preventDefault();
    const requestedFlagNumber = $('#RequestedFlagNumber').val().trim();

    if (!requestedFlagNumber) {
      $('#RequestedFlagNumber').val('');
      $('#flagAvailabilityResponse')
        .text('A flag number is required.')
        .css('color', 'red')
        .removeClass('hide-me');
      $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
    }

    if (requestedFlagNumber && requestedFlagNumber < 11) {
      $('#RequestedFlagNumber').val('');
      $('#flagAvailabilityResponse')
        .text('Flag numbers lower than 10 must be earned.')
        .css('color', 'red')
        .removeClass('hide-me');
      $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
    }

    if (requestedFlagNumber > 2999) {
      $('#RequestedFlagNumber').val('');
      $('#flagAvailabilityResponse')
        .text('Requested flag number must be lower than 3000.')
        .css('color', 'red')
        .removeClass('hide-me');
      $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
    }

    if (requestedFlagNumber > 10 && requestedFlagNumber < 3000) {
      $.ajax(`/api/v1/flag/${requestedFlagNumber}`, {
        type: 'GET',
      }).then((flagInfo) => {
        if (flagInfo) {
          $('#flagAvailabilityResponse')
            .text(`Flag #${requestedFlagNumber} is unavailable.`)
            .css('color', 'red')
            .removeClass('hide-me');
          $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
        } else {
          if (requestedFlagNumber >= 1201 && requestedFlagNumber < 3000) {
            $('#flagAvailabilityResponse')
              .text(`Flag #${requestedFlagNumber} is available with a $20 surcharge.`)
              .css('color', 'green')
              .removeClass('hide-me');
          } else {
            $('#flagAvailabilityResponse')
              .text(`Flag #${requestedFlagNumber} is available.`)
              .css('color', 'green')
              .removeClass('hide-me');
          }
          $('#saveNewFlagNumChoiceBtn').prop('disabled', false);
        }
      });
    }
  });

  // Handle Save New Flag Button
  $('#saveNewFlagNumChoiceBtn').on('click', function saveNewFlagNumChoiceBtn(e) {
    e.preventDefault();
    const UserID = $(this).data('userid');
    const whoami = $(this).data('whoami');
    const OrderID = $(this).data('orderid');
    enableWhen = $(this).data('enablewhen');
    const requestedFlagNumber = $('#RequestedFlagNumber').val().trim();
    const OrderUpdateInfo = {
      RegStep: 'FlagInProgress',
      whoami,
      RallyYear: 2025,
      UserID,
      OrderID,
      RequestedFlagNumber: requestedFlagNumber,
      FlagSurcharge,
    };

    if (!requestedFlagNumber || requestedFlagNumber < 11) {
      showToastrError('A flag number is required.');
      $('#RequestedFlagNumber').val('');
      $('#flagAvailabilityResponse').addClass('hide-me');
      $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
    }

    if (requestedFlagNumber > 2999) {
      showToastrError('Requested flag number must be lower than 3000.');
      $('#RequestedFlagNumber').val('');
      $('#flagAvailabilityResponse').addClass('hide-me');
      $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
    }

    if (requestedFlagNumber > 10 && requestedFlagNumber < 3000) {
      $.ajax('/api/v1/regFlow', {
        beforeSend() {
          $('.modal').css('display', 'none');
          $('.spinnerBox').removeClass('hide-me');
        },
        complete() {
          $('.spinnerBox').addClass('hide-me');
        },
        type: 'POST',
        data: OrderUpdateInfo,
      })
        .then(() => {
          location.reload();
        })
        .catch(() => {
          showToastrError('An error occured while reserving your flag.');
        });
    }
  });

  // Handle Flag Checkout Button
  $('#goToFlagCheckoutBtn').on('click', (e) => {
    e.preventDefault();
    $('#shopifyWarningModal2').css('display', 'block');
  });

  // Handle Checkout Now Button
  $('#goToShopifyFlagPaymentBtn').on('click', () => {
    window.open(FlagSurchargeCheckoutURL);
    $('#shopifyWarningModal2').css('display', 'none');
    $('#awaitingShopifyContent').removeClass('hide-me');
  });

  // Handle Verify Flag Order Status Link
  $('#checkFlagOrderStatus').on('click', function checkFlagOrderStatus() {
    const oid = $(this).data('orderid');
    console.log(`==== checkFlagOrderStatus Clicked for oid: ${oid} ====`);

    $.ajax(`/api/v1/orders/checkFlagOrderStatus/${oid}`, {
      type: 'GET',
    }).then(() => {
      location.reload();
    });
  });

  // Handle Continue to Summary Button
  $('#goToSummaryBtn').on('click', function goToSummaryBtn(e) {
    e.preventDefault();
    const OrderID = $(this).data('orderid');

    const FlagInfoCompleted = {
      RegStep: 'FlagComplete',
      OrderID,
      NextStepNum: 8,
    };

    $.ajax('/api/v1/regFlow', {
      type: 'POST',
      data: FlagInfoCompleted,
    })
      .then(() => {
        location.reload();
      })
      .catch(() => {
        showToastrError('An error occured while loading your summary.');
      });
  });

  /* #endregion */

  // ************************
  // ** Misc Support Items **
  // ************************
  /* #region  Misc Support Items */

  // Handle Dialog Close & Cancel Buttons
  $('.close, #cancelButton, .cancelButton').on('click', (e) => {
    e.preventDefault();
    $('.modal').css('display', 'none');
    $('.setAddressModal').css('display', 'none');
    $('#RequestedFlagNumber').val('');
    $('#flagAvailabilityResponse').addClass('hide-me');
    $('#saveNewFlagNumChoiceBtn').prop('disabled', true);
  });

  // Monitor for Continue to Summary Button to be enabled
  if (enableWhen === 'rider' && riderReady) {
    $('#goToSummaryBtn').prop('disabled', false);
  }
  if (enableWhen === 'pass' && riderReady && passReady) {
    $('#goToSummaryBtn').prop('disabled', false);
  }

  // Password validation
  function validatePassword() {
    const Password = $('#PassengerPasswordForm').val().trim();
    const PasswordConfirm = $('#PassengerPasswordConfirmForm').val().trim();

    if (Password !== PasswordConfirm) {
      $('#passwordValidationStatus').removeClass('hide-me');
      $('#passwordValidationStatus')
        .text('Passwords do not match, please try again.')
        .removeClass('labelValidationStatusSuccess')
        .addClass('labelValidationStatusFailed');
      $('#savePassengerInfo').prop('disabled', true);
    } else {
      $('#passwordValidationStatus')
        .text('Passwords match.')
        .removeClass('labelValidationStatusFailed')
        .addClass('labelValidationStatusSuccess');
      $('#savePassengerInfo').prop('disabled', false);
    }
  }

  // Email validation
  function validateEmail() {
    const Email = $('#PassengerEmailForm').val().trim();
    const EmailConfirm = $('#PassengerEmailFormConfirm').val().trim();

    if (Email !== EmailConfirm) {
      $('#emailValidationStatus').removeClass('hide-me');
      $('#emailValidationStatus')
        .text('Emails do not match, please try again.')
        .removeClass('labelValidationStatusSuccess')
        .addClass('labelValidationStatusFailed');
      $('#savePassengerInfo').prop('disabled', true);
    } else {
      $('#emailValidationStatus')
        .text('Emails match.')
        .removeClass('labelValidationStatusFailed')
        .addClass('labelValidationStatusSuccess');
      $('#savePassengerInfo').prop('disabled', false);
    }
  }

  // Show Toastr Alert
  function showToastrError(message) {
    const toastrOptions = {
      closeButton: 'true',
      positionClass: 'toast-top-center',
      preventDuplicates: 'true',
      progressBar: 'true',
      timeOut: '2500',
    };

    toastr.error(message, null, toastrOptions);
  }

  /* #endregion */
});
