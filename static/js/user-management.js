$(document).ready(function() {
  $('#usersTable').DataTable();
  $('#sponsorsTable').DataTable();

  // Handle Edit User Button
  $(".editUserButton").on("click", function() {
    console.log("edit user button clicked");
    var id = $(this).data("uid");
    $(".modal").css("display","block");
    $.ajax("/api/v1/user/" + id, {
      type: "GET",
    }).then(
      function(res) {
        console.log("==== User Response ====");
        console.log(res);
        $("#EditUserID").val(res.id);
        $("#EditUserName").val(res.UserName);
        $("#EditFlagNumber").val(res.FlagNumber);
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
    var isAdmin = false;
    if ($("#isAdmin").prop("checked") == true) {
      isAdmin = true
    }
    var updateUser = {
      UserID: id,
      FlagNumber: $("#EditFlagNumber").val().trim(),
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

});