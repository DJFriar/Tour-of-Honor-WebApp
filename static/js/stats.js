$(document).ready(() => {
  $('#riderStats').DataTable({
    "order": [[ 1, "desc" ]],
    "pageLength": 25
  });
});