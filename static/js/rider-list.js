$(document).ready(() => {
  $('#riderList').DataTable({
    "order": [[ 1, "desc" ]],
    "pageLength": 50
  });
});