$(document).ready(function() {
  $('#usersTable').DataTable({
    pageLength: 100
  });
  $('#sponsorsTable').DataTable();

  // Handle Edit User Button
  $(".editUserButton").on("click", function() {
    var id = $(this).data("uid");
    $(".modal").css("display","block");
    $.ajax("/api/v1/user/" + id, {
      type: "GET",
    }).then(
      function(res) {
        $("#EditUserID").val(res.id);
        $("#EditUserName").val(res.UserName);
        if (res.FlagNumber > 0) {
          $("#EditFlagNumber").val(res.FlagNumber);
        }
        $("#EditFirstName").val(res.FirstName);
        $("#EditLastName").val(res.LastName);
        $("#EditEmail").val(res.Email);
        $("#EditZipCode").val(res.ZipCode);
        if (res.isAdmin) {
          $("#isAdmin").prop("checked", true);
        } else {
          $("#isAdmin").prop("checked", false);
        }
      }
    )
  })

  // Handle Edit User Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Edit Dialog Cancel Button
  $("#cancelButton").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Save Changes Button
  $("#saveUserChangesButton").on("click", function() {
    var id = $("#EditUserID").val();
    var FlagNumber = 0;
    var isAdmin = false;

    if (parseInt($("#EditFlagNumber").val(),10) > 0) {
      FlagNumber = parseInt($("#EditFlagNumber").val(),10);
    }
    if ($("#isAdmin").prop("checked") == true) {
      isAdmin = true
    }
    
    var updateUser = {
      UserID: id,
      FlagNumber: FlagNumber,
      UserName: $("#EditUserName").val().trim(),
      FirstName: $("#EditFirstName").val().trim(),
      LastName: $("#EditLastName").val().trim(),
      Email: $("#EditEmail").val().trim(),
      ZipCode: $("#EditZipCode").val().trim(),
      isAdmin: isAdmin
    };
    $.ajax("/api/v1/user/", {
      type: "put",
      data: updateUser
    }).then(
      function() {
        location.reload();
      }
    );
  });

  // Handle Delete User Button
  $(".deleteUserButton").on("click", function() {
    var id = $(this).data("uid");
    $.ajax("/api/v1/user/" + id, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  });

});