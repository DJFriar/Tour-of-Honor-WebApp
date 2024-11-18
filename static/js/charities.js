$(document).ready(() => {
  $('#charitiesTable').DataTable({
    ajax: {
      url: '/api/v1/charity',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'Name' },
      { data: 'URL' },
      { data: 'RallyYear' },
      { data: 'TotalDonations' },
    ],
    columnDefs: [
      { targets: [0], visible: false },
      {
        render(data) {
          const totalAmount = data * 30;
          return `$${totalAmount}`;
        },
        targets: [4],
      },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Save to Excel',
        title: 'TOH Donation Summary',
        exportOptions: {
          columns: ':visible',
          modifier: {
            search: 'none',
          },
        },
      },
    ],
    pageLength: 10,
  });

  // Handle Dialog Close Button
  $('.close').on('click', () => {
    $('.modal').css('display', 'none');
  });

  // Handle Add New Charity Button
  $('#addNewCharityBtn').on('click', (e) => {
    e.preventDefault();
    $('#charityInfoAddModal').css('display', 'block');
  });

  // Handle Save New Charity Button
  $('#saveNewCharityBtn').on('click', (e) => {
    e.preventDefault();
    const charityInfo = {
      RallyYear: 2025,
      CharityName: $('#CharityName').val().trim(),
      CharityURL: $('#CharityURL').val().trim(),
    };

    $.ajax('/api/v1/charity', {
      type: 'POST',
      data: charityInfo,
    }).then(() => {
      location.reload();
    });
  });

  // Handle Charity Deletion
  $('.deleteCharityBtn').on('click', function () {
    const CharityID = $(this).data('charityid');

    $.ajax(`/api/v1/charity/${CharityID}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });
});
