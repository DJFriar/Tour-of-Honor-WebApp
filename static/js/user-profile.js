$(document).ready(() => {
  $('#riderSubmissionHistory').DataTable({
    "order": [[ 3, "desc" ]],
    "pageLength": 25
  });

  $('#riderBikeInfo').DataTable({
    "lengthChange": false,
    "order": [[ 0, "asc" ]],
    "paging": false,
    "searching": false
  });

  //Format Cell Number field into (nnn) nnn-nnnn
  $('#CellNumber').on('input', function (e){
    var $phoneField = e.target;
    var cursorPosition = $phoneField.selectionStart;
    var numericString = $phoneField.value.replace(/\D/g, '').substring(0, 10);

    // let user backspace over the '-'
    if (cursorPosition === 9 && numericString.length > 6) return;

    // let user backspace over the ') '
    if (cursorPosition === 5 && numericString.length > 3) return;
    if (cursorPosition === 4 && numericString.length > 3) return;

    var match = numericString.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
        var newVal = '(' + match[1];
        newVal += match[2] ? ') ' + match[2] : '';
        newVal += match[3] ? '-' + match[3] : '';

        // to help us put the cursor back in the right place
        var delta = newVal.length - Math.min($phoneField.value.length, 14);      
        $phoneField.value = newVal;
        $phoneField.selectionEnd = cursorPosition + delta;
    } else {
        $phoneField.value = '';        
    }
  })

  // Save changes to user profile
  $("#saveProfileEdits").on("click", function() {
    var UserID = $(this).data("userid");
    var RiderFlagNumber = $("#FlagNumber").val().trim();
    var PillionFlagNumberInput = $("#PillionFlagNumber").val().trim();

    // Replace flag number if N/A
    if (!RiderFlagNumber || RiderFlagNumber == "N/A") {
      RiderFlagNumber = 0;
    }
    if (!PillionFlagNumberInput || PillionFlagNumberInput == "N/A") {
      PillionFlagNumberInput = 0;
    }

    var updateUserProfile = {
      UserID,
      FirstName: $("#FirstName").val().trim(),
      LastName: $("#LastName").val().trim(),
      FlagNumber: RiderFlagNumber,
      PillionFlagNumber: PillionFlagNumberInput,
      Email: $("#Email").val().trim(),
      Address1: $("#Address1").val().trim(),
      City: $("#City").val().trim(),
      State: $("#State").val().trim(),
      ZipCode: $("#ZipCode").val().trim(),
      CellNumber: $("#CellNumber").val().trim(),
      TimeZone: $("#TimeZone").val().trim()
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
  $(".editBikeInfoBtn").on("click", function(e) {
    e.preventDefault();
    console.log("editBikeInfoBtn clicked");
    var BikeID = $(this).data("bikeid");

    $.ajax("/api/v1/bike/"+ BikeID, {
      type: "GET",
    }).then(
      function(res) {
        console.log("==== Bike Info: ====")
        console.log(res);
        $("#bikeInfoEditModal").css("display","block");
        $("#EditBikeID").val(res.id);
        $("#EditBikeYear").val(res.Year);
        $("#EditBikeMake").val(res.Make);
        $("#EditBikeModel").val(res.Model);
      }
    )
  })

  // Handle Save Edited Bike Info button
  $("#saveEditedBikeInfoBtn").on("click", function() {
    var editedBikeInfo = {
      BikeID: $("#EditBikeID").val().trim(),
      BikeYear: $("#EditBikeYear").val().trim(),
      BikeMake: $("#EditBikeMake").val().trim(),
      BikeModel: $("#EditBikeModel").val().trim(),
    }

    $.ajax("/api/v1/bike", {
      type: "PUT",
      data: editedBikeInfo
    }).then(
      function() { location.replace("/user-profile"); }
    )
  })

  // Handle Bike Deletion
  $(".deleteBikeBtn").on("click", function() {
    var BikeID = $(this).data("bikeid");

    $.ajax("/api/v1/bike/" + BikeID, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
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

  // Handle Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })
});