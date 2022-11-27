$(document).ready(() => {
  let allowFlagUpdate = false;
  let sourceFlagValid = false;
  let destinationFlagValid = false;
  // Reserved Flags DataTable
  var flagReservationsTable = $('#flagReservationsTable').DataTable({
    ajax: {
      url: '/api/v1/flag/reservation',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'FlagNumber' },
      { data: 'Notes' },
      { data: 'ReservedBy' },
      { data: null, name: 'Actions' },
    ],
    columnDefs: [
      { targets: [0], visible: false },
      {
        render(data, type, row) {
          return '<div class="releaseFlagNumberBtn" data-flagnumber="' + row['FlagNumber'] + '"><span class="toh-mr-8"><i class="fa-duotone fa-flag" style="--fa-primary-color: red; --fa-secondary-color: red;"></i></span>Release Flag</div>';
        },
        targets: [4],
      },
    ],
    dom: 'frtip',
    pageLength: 25,
  });

  // Handle Reserve Flag Number Button
  $('#ReserveFlagNumberBtn').on('click', (e) => {
    e.preventDefault(e);
    const FlagNumber = $('#FlagNumberToReserve').val().trim();
    const Notes = $('#FlagNumberToReserveNotes').val().trim();
    const ReservedBy = $('#ReserveFlagNumberBtn').data('userid');
    const FlagReservationInfo = {
      FlagNumber,
      Notes,
      ReservedBy,
    };
    $.ajax(`/api/v1/flag/reservation`, {
      type: 'POST',
      data: FlagReservationInfo,
    }).then(() => {
      flagReservationsTable.ajax.reload();
      toastr.success(`Flag ${FlagNumber} successfully reserved.`, null, {
        closeButton: 'false',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
      $('#FlagNumberToReserve').val('');
      $('#FlagNumberToReserveNotes').val('');
    });
  });

  // Handle Release Flag Number Button
  $('#flagReservationsTable').on('click', '.releaseFlagNumberBtn', function () {
    const FlagNumber = $(this).data('flagnumber');
    const FlagReleaseInfo = {
      FlagNumber,
    };
    $.ajax(`/api/v1/flag/reservation`, {
      type: 'DELETE',
      data: FlagReleaseInfo,
    }).then(() => {
      flagReservationsTable.ajax.reload();
      toastr.success(`Flag ${FlagNumber} released successfully.`, null, {
        closeButton: 'false',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
    });
  });

  // Lookup Rider Flag Number Info
  $('#FlagNumberToChange').on('input paste', function () {
    $('#flagNumberAssignedTo').addClass('hide-me');
    const flagNumber = $(this).val();
    if (flagNumber) {
      $.ajax(`/api/v1/riders/flag/${flagNumber}`, {
        type: 'GET',
      }).then((riderInfo) => {
        if (riderInfo.length > 0) {
          $('#flagNumberAssignedTo')
          .text(`${riderInfo[0].FullName}`)
          .css('color', 'green')
          .removeClass('hide-me');
          $('#UpdateFlagNumberAssignmentBtn').attr('data-rid',riderInfo[0].UserID);
          sourceFlagValid = true;
          enableUpdateFlagBtn();
        } else {
          $('#flagNumberAssignedTo')
          .text('No Flag Found!')
          .css('color', 'red')
          .removeClass('hide-me');
          sourceFlagValid = false;
          enableUpdateFlagBtn();
        }
      });
    }
  });

  // Check New Flag Number Availability
  $('#NewFlagNumber').on('input paste', function () {
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
          enableUpdateFlagBtn();
        } else {
          $('#flagNumberAvailableCheck')
          .text('Flag Available')
          .css('color', 'green')
          .removeClass('hide-me');
          destinationFlagValid = true;
          enableUpdateFlagBtn();
        }
      });
    }
  });

  // Handle Update Flag Button /flag/change PUT
  $('#UpdateFlagNumberAssignmentBtn').on('click', function () {
    const NewFlagNumber = $('#NewFlagNumber').val().trim();
    const OldFlagNumber = $('#FlagNumberToChange').val().trim();
    const UserID = $(this).data('rid');

    const FlagUpdateInfo = {
      FlagNumber: NewFlagNumber,
      UserID,
    };
    $.ajax(`/api/v1/flag/change`, {
      type: 'PUT',
      data: FlagUpdateInfo,
    }).then(() => {
      toastr.success(`Flag ${OldFlagNumber} was successfully updated to ${NewFlagNumber}.`, null, {
        closeButton: 'false',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
      $('#NewFlagNumber').val('');
      $('#FlagNumberToChange').val('');
    });
  })

  function enableUpdateFlagBtn() {
    if (sourceFlagValid && destinationFlagValid) {
      $('#UpdateFlagNumberAssignmentBtn').attr('disabled',false);
    } else {
      $('#UpdateFlagNumberAssignmentBtn').attr('disabled',true);
    }
  }

});