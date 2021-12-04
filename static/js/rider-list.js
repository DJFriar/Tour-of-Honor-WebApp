$(document).ready(() => {
  $('#riderList').DataTable({
    "order": [[ 0, "asc" ]],
    "pageLength": 50
  });
});