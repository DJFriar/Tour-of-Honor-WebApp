$(document).ready(() => {
  $('#riderSubmissionHistory').DataTable({
    "order": [[ 3, "desc" ]],
    "pageLength": 25
  });

  $('#riderBikeInfo').DataTable({
    "order": [[ 3, "desc" ]],
    "pageLength": 5
  });

  // Save changes to user profile
  $("#saveProfileEdits").on("click", function() {
    var UserID = $(this).data("userid");
    var PillionFlagNumberInput = $("#PillionFlagNumber").val().trim();
    if (!PillionFlagNumberInput || PillionFlagNumberInput == "N/A") {
      PillionFlagNumberInput = 0;
    }

    var updateUserProfile = {
      UserID,
      FirstName: $("#FirstName").val().trim(),
      LastName: $("#LastName").val().trim(),
      UserName: $("#UserName").val().trim(),
      FlagNumber: $("#FlagNumber").val().trim(),
      PillionFlagNumber: PillionFlagNumberInput,
      Email: $("#Email").val().trim(),
      City: $("#City").val().trim(),
      State: $("#State").val().trim(),
      ZipCode: $("#ZipCode").val().trim()
    }

    // Make sure that email field isn't blank.
    if (!updateUserProfile.Email) {
      handleLoginErr("Blank field detected.");
      return;
    }

    // Update the DB entry with the new data and logout the user.
    $.ajax("/api/v1/user", {
      type: "PUT",
      data: updateUserProfile
    }).then(
      function() { location.replace("/logout"); }
    );
  });
  
  // Handle Delete Submission
  $(".deleteSubmissionButton").on("click", function() {
    var id = $(this).data("uid");

    $.ajax("/handle-submission/" + id, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  });

  // Handle Add New Bike Button
  $("#addNewBikeBtn").on("click", function(e) {
    e.preventDefault();
    $("#bikeInfoAddModal").css("display","block");
  })

  // Handle Save New Bike Button
  $("#saveNewBikeInfoBtn").on("click", function() {
    var UserID = $(this).data("userid");

    var bikeInfo = {
      UserID,
      BikeName: $("#BikeName").val().trim(),
      BikeYear: $("#BikeYear").val().trim(),
      BikeMake: $("#BikeMake").val().trim(),
      BikeModel: $("#BikeModel").val().trim(),
    }

    $.ajax("/api/v1/bike", {
      type: "POST",
      data: bikeInfo
    }).then(
      function() { location.replace("/user-profile"); }
    )
  })

  // Handle Edit Bike Info Button
  $("#editBikeInfoBtn").on("click", function(e) {
    e.preventDefault();
    console.log("editBikeInfoBtn clicked");
    var Code = $("#MemorialCodeLookup").val().trim();
    Code = Code.toUpperCase();
    SampleImage = "";
    updatedSampleImage = false;

    $.ajax("/api/v1/memorial/c/"+ Code, {
      type: "GET",
    }).then(
      function(res) {
        console.log(res);
        if (res == undefined || res == null) {
          $("#memorialNotFoundErrorText").toggleClass("hide-me");
        } else if (res.Code == Code) {
          $("#memorialInfoEditModal").css("display","block");
          $(".uk-dropdown").removeClass("uk-open");

          SampleImage = res.SampleImage;

          var MultiImageBool = 0
          if (res.MultiImage) {
            MultiImageBool = 1;
          }
          $("#EditMemorialID").val(res.id);
          $("#EditMemorialCode").val(res.Code);
          $("#EditMemorialCategory").val(res.Category);
          $("#EditMemorialRegion").val(res.Region);
          $("#EditMemorialName").val(res.Name);
          $("#EditMemorialAddress1").val(res.Address1);
          $("#EditMemorialAddress2").val(res.Address2);
          $("#EditMemorialURL").val(res.URL);
          $("#EditMemorialCity").val(res.City);
          $("#EditMemorialState").val(res.State);
          $("#EditMemorialLatitude").val(res.Latitude);
          $("#EditMemorialLongitude").val(res.Longitude);
          $("#EditMemorialRestrictions").val(res.Restrictions);
          $("#EditMultiImage").val(MultiImageBool);
          $("#EditSampleImageName").val(res.SampleImage);
          $(".sampleImagePlaceholder").attr("src", baseSampleImageUrl + res.SampleImage);
          $("#EditSampleImageFile").attr("src", baseSampleImageUrl + res.SampleImage);
          $("#EditMemorialAccess").val(res.Access);
        } 
        
      }
    )
  })

  // Handle Reset Password Button
  $("#resetPasswordLink").on("click", function() {
    window.location.replace("/forgotpassword");
  });

  function handleLoginErr(err) {
    console.log(err);
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});