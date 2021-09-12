$(document).ready(function () {
  $('#ScoringTable').DataTable({
    "order": [[ 0, "asc" ]],
    "pageLength": 100
  });
})