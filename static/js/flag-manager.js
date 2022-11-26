$(document).ready(() => {
  // Reserved Flags DataTable
  $('#flagReservationsTable').DataTable({
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
          return '<div class="releaseFlagNumberBtn" data-flagnumber="' + row['FlagNumber'] + '"><i class="fa-light fa-pen-to-square fa-lg"></i> Release Flag</div>';
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
    console.log('==== ReserveFlagNumberBtn ====');
    console.log(`${FlagNumber} / ${Notes} / ${ReservedBy}`);
    const FlagReservationInfo = {
      FlagNumber,
      Notes,
      ReservedBy,
    };
    $.ajax(`/api/v1/flag/reservation`, {
      type: 'POST',
      data: FlagReservationInfo,
    }).then(() => {
      toastr.success(`Flag ${FlagNumber} successfully reserved.`, null, {
        closeButton: 'false',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
    });
  });

  // Handle Release Flag Number Button
  $('#flagReservationsTable').on('click', '.releaseFlagNumberBtn', function () {
    const FlagNumber = $(this).data('flagnumber');
    console.log('==== ReleaseFlagNumberBtn ====');
    console.log(`Releasing ${FlagNumber}`);
    const FlagReleaseInfo = {
      FlagNumber,
    };
    $.ajax(`/api/v1/flag/reservation`, {
      type: 'DELETE',
      data: FlagReleaseInfo,
    }).then(() => {
      toastr.success(`Flag ${FlagNumber} released successfully.`, null, {
        closeButton: 'false',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
      location.reload();
    });
  });
});
