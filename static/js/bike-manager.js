$(document).ready(() => {
  $('#bikeMakesTable').DataTable({
    ajax: {
      url: '/api/v1/bike/make',
      dataSrc: '',
    },
    columns: [{ data: 'id' }, { data: 'Name' }],
    columnDefs: [{ targets: [0], visible: false }],
    language: {
      entries: {
        _: 'bikes',
        1: 'bike',
      },
    },
    layout: {
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging',
    },
    pageLength: 25,
    order: [[1, 'asc']],
  });

  // Handle Dialog Close Button
  $('.close').on('click', () => {
    $('.modal').css('display', 'none');
  });

  // Handle Add New Bike Make Button
  $('#addNewBikeMakeBtn').on('click', (e) => {
    e.preventDefault();
    $('#bikeMakeAddModal').css('display', 'block');
  });

  // Handle Save New Bike Make Button
  $('#saveNewBikeMakeBtn').on('click', (e) => {
    e.preventDefault();
    const bikeMakeInfo = {
      BikeMakeName: $('#BikeMakeName').val().trim(),
    };

    $.ajax('/api/v1/bike/make', {
      type: 'POST',
      data: bikeMakeInfo,
    }).then(() => {
      location.reload();
    });
  });

  // Handle Bike Make Deletion
  $('.deleteBikeMakeBtn').on('click', function () {
    const BikeMakeID = $(this).data('charityid');

    $.ajax(`/api/v1/bike/make/${BikeMakeID}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });
});
