$(document).ready(() => {
  $('#enableStateMemDisplay').on('click', () => {
    $.ajax('/api/v1/admin/startSeason', {
      type: 'POST',
    })
      .then(() => {
        toastr.success('Success! State Memorials are now visible.', null, {
          closeButton: 'true',
          positionClass: 'toast-top-center',
          preventDuplicates: 'true',
          progressBar: 'false',
          timeOut: '0',
        });
      })
      .catch((err) => {
        console.log(err);
        handleStateMemEnableError();
      });
  });

  function handleStateMemEnableError() {
    toastr.error('An error was encountered. Please try again.', null, {
      closeButton: 'true',
      positionClass: 'toast-top-center',
      preventDuplicates: 'true',
      progressBar: 'false',
      timeOut: '0',
    });
  }
});
