$(document).ready(() => {
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
});
