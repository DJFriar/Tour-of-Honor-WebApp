/* eslint-disable prettier/prettier */
$(document).ready(() => {
  const userID = $('#saveProfileEdits').data('userid');
  const userTimeZone = $('#userTZ').data('usertz');
  const messageIcon = '&nbsp;<i class="fa-light fa-message-lines"></i>';
  $('#riderSubmissionHistory').DataTable({
    ajax: {
      url: `/api/v1/submission/byUser/${userID}`,
      dataSrc: '',
    },
    columns: [
      { data: 'id' },                         // 0
      { data: 'Code' },                       // 1
      { data: 'Name' },                       // 2
      { data: 'Category' },                   // 3
      { data: 'StatusID' },                   // 4
      { data: 'createdAt' },                  // 5
      { data: null, Name: 'Actions' },        // 6
      { data: 'ScorerNotes' },                // 7
      { data: 'Status' },                     // 8
      { data: 'Source' },                     // 9
    ],
    columnDefs: [
      {
        render(data, type, row) {
          if (type === 'display') {
            switch (row.Source) {
              case 1:
                return `<i class="fa-light fa-square-question"></i>&nbsp;<a href="/memorial/${data}" target="_blank">${data}</a>`;
              case 2:
                return `<i class="fa-brands fa-apple"></i>&nbsp;<a href="/memorial/${data}" target="_blank">${data}</a>`;
              case 3:
                return `<i class="fa-brands fa-android"></i>&nbsp;<a href="/memorial/${data}" target="_blank">${data}</a>`;
              case 4:
                return `<i class="fa-solid fa-browser"></i>&nbsp;<a href="/memorial/${data}" target="_blank">${data}</a>`;
              case 5:
                return `<i class="fa-light fa-envelope"></i>&nbsp;<a href="/memorial/${data}" target="_blank">${data}</a>`;
              case 6:
                return `<i class="fa-brands fa-usps"></i>&nbsp;<a href="/memorial/${data}" target="_blank">${data}</a>`;
              default:
                return `<i class="fa-light fa-square-question"></i>&nbsp;<a href="/memorial/${data}" target="_blank">${data}</a>`;
            }
          }
          return data;
        },
        targets: [1],
      },
      {
        render(data, type, row) {
          switch (data) {
            case 0:
              return `<span uk-tooltip="${
                row.ScorerNotes
              }"><i class="fa-light fa-clock"></i>&nbsp;${row.Status}${
                row.ScorerNotes ? messageIcon : ''
              }</span>`;
            case 1:
              return `<span uk-tooltip="${
                row.ScorerNotes
              }"><i class="fa-solid fa-shield-check" color="green"></i>&nbsp;${row.Status}${
                row.ScorerNotes ? messageIcon : ''
              }</span>`;
            case 2:
              return `<span uk-tooltip="${
                row.ScorerNotes
              }"><i class="fa-solid fa-shield-exclamation" color="red"></i>&nbsp;${row.Status}${
                row.ScorerNotes ? messageIcon : ''
              }</span>`;
            case 3:
              return `<span uk-tooltip="${
                row.ScorerNotes
              }"><i class="fa-solid fa-pause" color="orange"></i>&nbsp;${row.Status}${
                row.ScorerNotes ? messageIcon : ''
              }</span>`;
            default:
              return `[ERROR]`;
          }
        },
        targets: [4],
      },
      {
        render(data, type) {
          if (type === 'display') {
            const createdDate = new Date(data);
            return `${createdDate.toLocaleString('en-US', { timeZone: userTimeZone })}`;
          }
          return data;
        },
        targets: [5],
      },
      {
        render(data, type, row) {
          if (row.StatusID === 0) {
            return `<span class='deleteSubmissionButton clickable' uk-tooltip="Delete Submission" data-uid='${row.id}'><i class="fa-light fa-trash-can"></i></span>&nbsp;`;
          }
          return '';
        },
        targets: [6],
      },
      { targets: [0, 7, 8, 9], visible: false, Searchable: false },
    ],
    order: [[5, 'desc']],
    pageLength: 25,
  });

  $('#riderBikeInfo').DataTable({
    lengthChange: false,
    order: [[0, 'asc']],
    paging: false,
    searching: false,
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

  // Save changes to user profile
  $('#saveProfileEdits').on('click', function () {
    const UserID = $(this).data('userid');
    let RiderFlagNumber = $('#FlagNumber').val().trim();
    let PillionFlagNumberInput = $('#PillionFlagNumber').val().trim();

    // Replace flag number if N/A
    if (!RiderFlagNumber || RiderFlagNumber === 'N/A') {
      RiderFlagNumber = 0;
    }
    if (!PillionFlagNumberInput || PillionFlagNumberInput === 'N/A') {
      PillionFlagNumberInput = 0;
    }

    const updateUserProfile = {
      UserID,
      FirstName: $('#FirstName').val().trim(),
      LastName: $('#LastName').val().trim(),
      PillionFlagNumber: PillionFlagNumberInput,
      Email: $('#Email').val().trim(),
      Address1: $('#Address1').val().trim(),
      City: $('#City').val().trim(),
      State: $('#State').val().trim(),
      ZipCode: $('#ZipCode').val().trim(),
      CellNumber: $('#CellNumber').val().trim(),
      TimeZone: $('#TimeZone').val().trim(),
    };

    // Make sure that email field isn't blank.
    if (!updateUserProfile.Email) {
      handleLoginErr('Blank field detected.');
      return;
    }

    // Update the DB entry with the new data and logout the user.
    $.ajax('/api/v1/user', {
      type: 'PUT',
      data: updateUserProfile,
    }).then(() => {
      location.reload();
    });
  });

  // Handle Delete Submission
  $('.deleteSubmissionButton').on('click', function () {
    const id = $(this).data('uid');

    $.ajax(`/handle-submission/${id}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });

  // Handle Add New Bike Button
  $('#addNewBikeBtn').on('click', (e) => {
    e.preventDefault();
    $('#bikeInfoAddModal').css('display', 'block');
  });

  // Character counter for Bike Model box
  $('#BikeModel, #EditBikeModel').keyup(function () {
    countChar(this);
  });

  // Handle Save New Bike Button
  $('#saveNewBikeInfoBtn').on('click', function () {
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
      location.replace('/user-profile');
    });
  });

  // Handle Edit Bike Info Button
  $('.editBikeInfoBtn').on('click', function (e) {
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
      $('.characterCount').text(`Characters remaining: ${25 - res.Model.length}`);
    });
  });

  // Handle Save Edited Bike Info button
  $('#saveEditedBikeInfoBtn').on('click', () => {
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
      location.replace('/user-profile');
    });
  });

  // Handle Bike Deletion
  $('.deleteBikeBtn').on('click', function () {
    const BikeID = $(this).data('bikeid');

    $.ajax(`/api/v1/bike/${BikeID}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });

  // Handle Reset Password Button
  $('#resetPasswordLink').on('click', () => {
    window.location.replace('/forgotpassword');
  });

  function handleLoginErr(err) {
    $('#alert .msg').text(err.responseJSON);
    $('#alert').fadeIn(500);
  }

  // Handle Dialog Close Button
  $('.close').on('click', () => {
    $('.modal').css('display', 'none');
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
});
