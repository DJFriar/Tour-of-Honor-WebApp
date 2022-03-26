$(document).ready(function () {
  // Create the Pending Table
  var pendingTable = $('#PendingTable').DataTable({
    "order": [[ 0, "asc" ]],
    "pageLength": 100,
    "columnDefs": [
      {
        "targets": [0],
        "visible": false,
        "Searchable": false
      },
      {
        "targets": [1],
        "visible": false,
        "Searchable": false
      }
    ]
  });

  // Prefilter out just the pending items
  pendingTable.column(1)
  .search(0)
  .draw()
  var pendingTableData = pendingTable.rows({order:'current', search:'applied'}).data();

  // Create the Held for Review Table
  var heldTable = $('#HeldTable').DataTable({
    "order": [[ 0, "asc" ]],
    "pageLength": 20,
    "columnDefs": [
      {
        "targets": [0],
        "visible": false,
        "Searchable": false
      },
      {
        "targets": [1],
        "visible": false,
        "Searchable": false
      }
    ]
  });
  // Prefilter out just the held items
  heldTable.column(1)
  .search(3)
  .draw()
  var heldTableData = heldTable.rows({order:'current', search:'applied'}).data();

  // Create the Scored Table
  var scoredTable = $('#ScoredTable').DataTable({
    "order": [[ 1, "desc" ]],
    "pageLength": 50,
    "columnDefs": [
      {
        "targets": [0],
        "visible": false,
        "Searchable": false
      },
      {
        "targets": [1],
        "visible": false,
        "Searchable": false
      }
    ]
  });

  var scoredTableData  = scoredTable.rows().data();

  // Force tables to be full width
  $('table#PendingTable').css('width', '100%');
  $('table#HeldTable').css('width', '100%');
  $('table#ScoredTable').css('width', '100%');
  
  // Handle Filter Buttons on Pending Table
  localStorage.setItem("categoryFilter","All");

  $('.showAllSubmissions').on('click', () => {
    $(".submissionFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".submissionFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showAllSubmissions").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("All");
    
  })
  $('.showTOHSubmissions').on('click', () => {
    $(".submissionFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".submissionFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showTOHSubmissions").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("Tour of Honor");
  })
  $('.show911Submissions').on('click', () => {
    $(".submissionFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".submissionFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".show911Submissions").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("9/11");
  })
  $('.showDBSubmissions').on('click', () => {
    $(".submissionFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".submissionFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showDBSubmissions").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("Doughboys");
  })
  $('.showGSFSubmissions').on('click', () => {
    $(".submissionFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".submissionFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showGSFSubmissions").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("Gold Star Family");
  })
  $('.showK9Submissions').on('click', () => {
    $(".submissionFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".submissionFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showK9Submissions").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("War Dogs / K9");
  })
  $('.showMadonnaSubmissions').on('click', () => {
    $(".submissionFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".submissionFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showMadonnaSubmissions").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("Madonna Trail");
  })
  $('.showHueySubmissions').on('click', () => {
    $(".submissionFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".submissionFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showHueySubmissions").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("Hueys");
  })
  $('.showSOLMemorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showSOLMemorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("Statue of Liberty");
  })
  $('.showCemeteryMemorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showCemeteryMemorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setSubmissionFilter("Cemetery");
  })

  function setSubmissionFilter(category) {
    localStorage.setItem("categoryFilter",category);
    if (category == "All") {
      pendingTable.column(5)
      .search("")
      .draw()
      pendingTableData = pendingTable.rows({order:'current', search:'applied'}).data();
    } else {
      pendingTable.column(5)
      .search(category)
      .draw()
      pendingTableData = pendingTable.rows({order:'current', search:'applied'}).data();
    }
  }
})