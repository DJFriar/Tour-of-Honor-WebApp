$(document).ready(function () {
  var table = $('#ScoringTable').DataTable({
    "order": [[ 0, "asc" ]],
    "pageLength": 100,
    "columnDefs": [
      {
        "targets": [0],
        "visible": false,
        "Searchable": false
      }
    ]
  });

  localStorage.setItem("categoryFilter","All");

  var tableData  = table.rows().data();

  // Handle Filter Buttons
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

  function setSubmissionFilter(category) {
    localStorage.setItem("categoryFilter",category);
    if (category == "All") {
      table.column(4)
      .search("")
      .draw()
      tableData = table.rows({order:'current', search:'applied'}).data();
      console.log("==== tableData ====");
      console.log(tableData);
    } else {
      table.column(4)
      .search(category)
      .draw()
      tableData = table.rows({order:'current', search:'applied'}).data();
      console.log("==== tableData ====");
      console.log(tableData);
    }
  }
})