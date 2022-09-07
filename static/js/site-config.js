$(document).ready(() => {
  $('#siteConfig').DataTable({
    "order": [[ 1, "desc" ]],
    "pageLength": 25
  });
});