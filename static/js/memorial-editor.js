/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
$(document).ready(() => {
  $('#memorialTable').DataTable({
    ajax: {
      url: '/api/v1/memorials',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'Code' },
      { data: 'CategoryName' },
      { data: 'Name' },
      { data: 'City' },
      { data: 'State' },
      { data: 'Access' },
      { data: 'RestrictionName' },
      { data: '', name: 'Actions' },
      { data: 'URL' },
      { data: 'Latitude' },
      { data: 'Longitude' },
    ],
    columnDefs: [
      { targets: [0, 9, 10, 11], visible: false },
      {
        render(data) {
          return `<span style="font-family: 'Source Code Pro', monospace;"><a href="/memorial/${data}">${data}</a></span>`;
        },
        targets: [1],
      },
      {
        render(data, type, row) {
          if (row.URL) {
            return `<a href="${row.URL}" target="_blank">${data}</a>&nbsp;<a href="https://maps.google.com/maps?t=m&q=loc:${row.Latitude},${row.Longitude}" target="_blank"><span class=""><i class="fa-duotone fa-map-location-dot"></i></span></a>`;
          }
          return `${data}&nbsp;<a href="https://maps.google.com/maps?t=m&q=loc:${row.Latitude},${row.Longitude}" target="_blank"><span class=""><i class="fa-duotone fa-map-location-dot"></i></span></a>`;
        },
        targets: [3],
      },
      {
        render(data) {
          if (data === 'None') {
            return data;
          }
          return `<span style="color: red;">${data}</span>`;
        },
        targets: [7],
      },
      {
        render(data, type, row) {
          return `
            <div class="uk-inline">
              <button class="uk-button uk-button-default" type="button">Actions</button>
              <div class="memorialActionDropdown" uk-dropdown="pos: bottom-justify; boundary: .boundary-align; boundary-align: true; mode: click">
                <button class="uk-button uk-button-link toh-mb-8" type="button"><span class="editMemorialInfoBtn" data-uid="${row.id}"><i class="fa-light fa-pen-to-square"></i> Edit Memorial Info</span></button>
                <button class="uk-button uk-button-link toh-mb-8" type="button"><span class="editMemorialTextBtn" data-memcode="${row.Code}"<i class="fa-light fa-pen-to-square"></i> Edit Memorial Text</span></button>
                <button class="uk-button uk-button-link" type="button"><span class="deleteMemorialBtn" data-uid="${row.id}"><i class="fa-light fa-trash-can"></i> Delete Memorial</span></button>
              </div>
            </div>
          `;
        },
        targets: [8],
      },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Save to Excel',
        title: 'TOH Memorials',
        exportOptions: {
          modifier: {
            search: 'none',
          },
        },
      },
    ],
    pageLength: 50,
  });

  // $('#memorialTable').DataTable({
  //   pageLength: 50,
  //   columns: [
  //     { width: '12%' },
  //     { width: '30%' },
  //     { width: '16%' },
  //     { width: '8%' },
  //     { width: '8%' },
  //     null,
  //   ],
  // });

  // Handle Bulk Upload Button
  // $('.bulkAddMemorialButton').on('click', (e) => {
  //   e.preventDefault();
  //   $('#bulkAddMemorialFile').toggleClass('hide-me');
  // });

  // Handle csv upload
  // let data;
  // function handleFileSelect(e) {
  //   const file = e.target.files[0];
  //   Papa.parse(file, {
  //     header: true,
  //     dynamicTyping: true,
  //     complete(results) {
  //       data = results;
  //     },
  //   });
  // }
  // $('#csv-file').change(handleFileSelect);

  // Handle Edit Memorial Info Button
  $('#memorialTable').on('click', '.editMemorialInfoBtn', function () {
    const id = $(this).data('uid');
    $('#memorialInfoEditModal').css('display', 'block');
    $('.uk-dropdown').removeClass('uk-open');
    $.ajax(`/api/v1/memorial/${id}`, {
      type: 'GET',
    }).then((res) => {
      let MultiImageBool = 0;
      if (res.MultiImage) {
        MultiImageBool = 1;
      }
      $('#EditMemorialID').val(res.id);
      $('#EditMemorialCode').val(res.Code);
      $('#EditMemorialCategory').val(res.Category);
      $('#EditMemorialRegion').val(res.Region);
      $('#EditMemorialName').val(res.Name);
      $('#EditMemorialAddress1').val(res.Address1);
      $('#EditMemorialAddress2').val(res.Address2);
      $('#EditMemorialURL').val(res.URL);
      $('#EditMemorialCity').val(res.City);
      $('#EditMemorialState').val(res.State);
      $('#EditMemorialLatitude').val(res.Latitude);
      $('#EditMemorialLongitude').val(res.Longitude);
      $('#EditMemorialRestrictions').val(res.Restrictions);
      $('#EditMultiImage').val(MultiImageBool);
      $('#EditSampleImage').val(res.SampleImage);
      $('#EditMemorialAccess').val(res.Access);
    });
  });

  // Handle Edit Memorial Text Button
  $('#memorialTable').on('click', '.editMemorialTextBtn', function () {
    console.log('==== editMemorialTextBtn clicked ====');
    const memcode = $(this).data('memcode');
    const editorURL = `/admin/memorial-text/${memcode}`;
    $('.uk-dropdown').removeClass('uk-open');
    window.open(editorURL);
  });

  // Handle add new memorial toggle
  $('.addMemorialButton').on('click', (e) => {
    e.preventDefault();
    $('#editMemorialInfo').toggleClass('hide-me');
    $('.memorialBtnDiv').toggleClass('hide-me');
  });

  // Handle Image Needed checkbox
  $('#ImageNeeded').change(function () {
    if (this.checked) {
      $('#SampleImage').val('imageNeeded.png');
    } else {
      $('#SampleImage').val('');
    }
  });
  $('#EditImageNeeded').change(function () {
    if (this.checked) {
      $('#EditSampleImage').val('imageNeeded.png');
    } else {
      $('#EditSampleImage').val('');
    }
  });

  // Handle Delete Memorial Button
  $('.deleteMemorialBtn').on('click', function () {
    const id = $(this).data('uid');
    $.ajax(`/api/v1/memorial/${id}`, {
      type: 'DELETE',
    }).then(() => {
      location.reload();
    });
  });

  // Handle Dialog Close Button
  $('.close').on('click', () => {
    $('.modal').css('display', 'none');
  });

  // Handle Dialog Cancel Button
  $('.cancelButton').on('click', () => {
    $('.modal').css('display', 'none');
  });

  // Handle Save Changes Button
  $('#saveMemorialChangesButton').on('click', (e) => {
    e.preventDefault();
    const id = $('#EditMemorialID').val();

    const updateMemorial = {
      MemorialID: id,
      Code: $('#EditMemorialCode').val().trim(),
      Category: $('#EditMemorialCategory').val().trim(),
      Region: $('#EditMemorialRegion').val().trim(),
      Name: $('#EditMemorialName').val().trim(),
      Address1: $('#EditMemorialAddress1').val().trim(),
      Address2: $('#EditMemorialAddress2').val().trim(),
      URL: $('#EditMemorialURL').val().trim(),
      City: $('#EditMemorialCity').val().trim(),
      State: $('#EditMemorialState').val().trim(),
      Latitude: $('#EditMemorialLatitude').val().trim(),
      Longitude: $('#EditMemorialLongitude').val().trim(),
      Restrictions: $('#EditMemorialRestrictions').val().trim(),
      MultiImage: $('#EditMultiImage').val().trim(),
      SampleImage: $('#EditSampleImage').val().trim(),
      Access: $('#EditMemorialAccess').val().trim(),
    };
    console.log(updateMemorial);
    $.ajax('/api/v1/memorial/', {
      type: 'put',
      data: updateMemorial,
    }).then(() => {
      location.reload();
    });
  });
});
