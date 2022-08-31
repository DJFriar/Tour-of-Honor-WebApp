$(document).ready(function() {
  $('#groupsTable').DataTable({
    pageLength: 25
  });

  // Handle Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Add New Group Button
  $("#addNewGroupBtn").on("click", function(e) {
    e.preventDefault();
    $("#GroupInfoAddModal").css("display","block");
  })

  // Handle Save New Group Button
  $("#saveNewGroupBtn").on("click", function(e) {
    var groupInfo = {
      GroupName: $("#GroupName").val().trim(),
      GroupDescription: $("#GroupDescription").val().trim(),
      GroupIsAdmin: $("#isAdmin").is(":checked"),
      GroupIsActive: $("#isActive").is(":checked")
    }

    $.ajax("/api/v1/group", {
      type: "POST",
      data: groupInfo
    }).then(
      function() { location.reload; }
    )
  })

  // Handle Group Disabling
  $(".disableGroupBtn").on("click", function() {
    var GroupID = $(this).data("groupid");

    var groupUpdate = {
      GroupIsActive: 0
    }

    $.ajax("/api/v1/group/" + GroupID, {
      type: "PUT",
      data: groupUpdate
    }).then(
      function() {
        location.reload();
      }
    );
  })

})
