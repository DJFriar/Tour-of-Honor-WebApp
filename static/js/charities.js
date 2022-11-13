$(document).ready(function() {
  $('#charitiesTable').DataTable({
    pageLength: 25
  });

  // Handle Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Add New Charity Button
  $("#addNewCharityBtn").on("click", function(e) {
    e.preventDefault();
    $("#charityInfoAddModal").css("display","block");
  })

  // Handle Save New Charity Button
  $("#saveNewCharityBtn").on("click", function(e) {
    var charityInfo = {
      RallyYear: 2023,
      CharityName: $("#CharityName").val().trim(),
      CharityURL: $("#CharityURL").val().trim(),
    }

    $.ajax("/api/v1/charity", {
      type: "POST",
      data: charityInfo
    }).then(
      function() { location.replace("/admin/charity-manager"); }
    )
  })

  // Handle Charity Deletion
  $(".deleteCharityBtn").on("click", function() {
    var CharityID = $(this).data("charityid");

    $.ajax("/api/v1/charity/" + CharityID, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  })

})
