$(document).ready(function() {
  var table = $('#memorialTable').DataTable({
    "order": [[ 0, "asc" ]],
    "pageLength": 100,

  });

  localStorage.setItem("memorialCategoryFilter","All");

  var tableData  = table.rows().data();

  // Handle Filter Buttons
  $('.showAllMemorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showAllMemorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setMemorialFilter("All");
    
  })
  $('.showTOHMemorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showTOHMemorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setMemorialFilter("Tour of Honor");
  })
  $('.show911Memorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".show911Memorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setMemorialFilter("9/11");
  })
  $('.showDBMemorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showDBMemorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setMemorialFilter("Doughboys");
  })
  $('.showGSFMemorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showGSFMemorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setMemorialFilter("Gold Star Family");
  })
  $('.showK9Memorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showK9Memorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setMemorialFilter("War Dogs / K9");
  })
  $('.showMadonnaMemorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showMadonnaMemorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setMemorialFilter("Madonna Trail");
  })
  $('.showHueyMemorials').on('click', () => {
    $(".MemorialFilterButton").prevAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".MemorialFilterButton").nextAll().removeClass("uk-button-primary").addClass("uk-button-secondary");
    $(".showHueyMemorials").removeClass("uk-button-secondary").addClass("uk-button-primary");
    setMemorialFilter("Hueys");
  })

  function setMemorialFilter(category) {
    localStorage.setItem("memorialCategoryFilter",category);
    if (category == "All") {
      table.column(1)
      .search("")
      .draw()
      tableData = table.rows({order:'current', search:'applied'}).data();
    } else {
      table.column(1)
      .search(category)
      .draw()
      tableData = table.rows({order:'current', search:'applied'}).data();
    }
  }
});



