$(document).ready(() => {
  // Photo Rules DataTable
  const photoRulesTable = $('#photoRulesTable').DataTable({
    ajax: {
      url: '/api/v1/photoRule',
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'RuleName' },
      { data: 'RuleText' },
      { data: null, name: 'Actions' },
    ],
    columnDefs: [
      { targets: [0], visible: false },
      {
        render(data, type, row) {
          return `<div class="deletePhotoRuleBtn" data-deletephotoruleid="${row.id}"><span class="toh-mr-8"><i class="fa-light fa-trash-can fa-lg"></i></span>Delete</div><div class="editPhotoRuleBtn" data-editphotoruleid="${row.id}"><span class="toh-mr-8"><i class="fa-light fa-pen-to-square"></i></span>Edit</div>`;
        },
        targets: [3],
      },
    ],
    language: {
      entries: {
        _: 'rules',
        1: 'rule',
      },
    },
    layout: {
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging',
    },
    pageLength: 25,
  });

  $('table#photoRulesTable').css('width', '100%');

  // Handle Reserve Flag Number Button
  $('#SaveNewPhotoRuleBtn').on('click', (e) => {
    e.preventDefault(e);
    const RuleName = $('#PhotoRuleName').val().trim();
    const RuleText = $('#PhotoRuleText').val().trim();
    const PhotoRuleData = {
      RuleName,
      RuleText,
    };
    $.ajax(`/api/v1/photorule`, {
      type: 'POST',
      data: PhotoRuleData,
    }).then(() => {
      photoRulesTable.ajax.reload();
      toastr.success(`Photo rule successfully added.`, null, {
        closeButton: 'false',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
      $('#PhotoRuleName').val('');
      $('#PhotoRuleText').val('');
    });
  });

  // Handle Edit Photo Rule Button
  $('#photoRulesTable').on('click', '.editPhotoRuleBtn', () => {
    const EditPhotoRuleID = $(this).data('editphotoruleid');
    console.log(`=== editPhotoRuleBtn was clicked for ${EditPhotoRuleID}. ===`);
  });

  // Handle Delete Photo Rule Button
  $('#photoRulesTable').on('click', '.deletePhotoRuleBtn', function () {
    const DeletePhotoRuleID = $(this).data('deletephotoruleid');
    console.log(`=== deletePhotoRuleBtn was clicked for ${DeletePhotoRuleID}. ===`);
    const PhotoRuleInfo = {
      id: DeletePhotoRuleID,
    };
    $.ajax(`/api/v1/photoRule`, {
      type: 'DELETE',
      data: PhotoRuleInfo,
    }).then(() => {
      photoRulesTable.ajax.reload();
      toastr.success(`Photo rule ${DeletePhotoRuleID} successfully deleted.`, null, {
        closeButton: 'false',
        positionClass: 'toast-top-center',
        preventDuplicates: 'true',
        progressBar: 'true',
        timeOut: '2500',
      });
    });
  });
});
