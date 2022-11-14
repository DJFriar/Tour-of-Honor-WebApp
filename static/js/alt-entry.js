$(document).ready(() => {
  // Handle Memorial Earned Button
  $('#markMemorialEarned').on('click', () => {
    const memorialCode = $('#MemorialCode').val();
    const flagNumber = $('#FlagNumber').val();
    const earnedMemorial = {
      MemorialCode: memorialCode,
      FlagNumber: flagNumber,
    };

    $.ajax('/handle-alt-entry', {
      type: 'PUT',
      data: earnedMemorial,
    }).then(() => {
      location.reload();
    });
  });
});
