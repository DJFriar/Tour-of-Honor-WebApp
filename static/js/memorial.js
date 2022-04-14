$(document).ready(function() {

  if ($("#MultiImage").val() == "0") {
    $("#input-primary").bind("change keyup", function () {      
      if ($("#input-primary").val() != "") {
        $(this).closest("form").find(":submit").removeAttr("disabled");
        $("#buttonSpan").removeAttr("uk-tooltip");
      } else {
        $(this).closest("form").find(":submit").attr("disabled", "disabled");      
      }
    });
  }
  
  if ($("#MultiImage").val() == "1") {
    $("#input-primary").bind("change keyup", function () {      
      if ($("#input-primary").val() != "" && $("#input-optional").val() != "") {
        $(this).closest("form").find(":submit").removeAttr("disabled");
        $("#buttonSpan").removeAttr("uk-tooltip");
      } else {
        $(this).closest("form").find(":submit").attr("disabled", "disabled");      
      }
    });
    $("#input-optional").bind("change keyup", function () {      
      if ($("#input-optional").val() != "" && $("#input-primary").val() != "") {
        $(this).closest("form").find(":submit").removeAttr("disabled");
        $("#buttonSpan").removeAttr("uk-tooltip");
      } else {
        $(this).closest("form").find(":submit").attr("disabled", "disabled");      
      }
    });
  }

  // Validate that primary image is present before allowing submissions
  // $("#input-primary").bind("change keyup", function () {      
  //   if ($("#input-primary").val() != "" && $("#MultiImage").val() == "0") {
  //     $(this).closest("form").find(":submit").removeAttr("disabled");
  //     $("#buttonSpan").removeAttr("uk-tooltip");
  //   } else {
  //     $(this).closest("form").find(":submit").attr("disabled", "disabled");      
  //   }
  // });

  // Validate that secondary image is present when required
  // $("#input-optional").bind("change keyup", function () {
  //   if ($("#MultiImage").val() == "1") {
  //     if ($("#input-optional").val() != "" && $("#input-primary").val() != "") {
  //       $(this).closest("form").find(":submit").removeAttr("disabled");
  //       $("#buttonSpan").removeAttr("uk-tooltip");
  //     } else {
  //       $(this).closest("form").find(":submit").attr("disabled", "disabled");      
  //     }
  //   }
  // });

  // Validate Scorer Notes before allowing Rejection
  // $("#scorerNotes").on("input", function () { 
  //   var scorerNotes = $("#scorerNotes").val().trim()
  //   if (MultiImage == 1) {
  //     $(".rejectButton").removeAttr("disabled");
  //     $("#rejectButtonSpan").removeAttr("uk-tooltip");
  //   } else {
  //     $(".rejectButton").attr("disabled", "disabled");      
  //   }
  // });

  $("#isGroupSubmission").change(function() {
    if (this.checked) {
      $("#GroupRiderInfoDiv").removeClass("hide-me")
      $("#GroupRiderInfo").prop("required", true);
    } else {
      $("#GroupRiderInfoDiv").addClass("hide-me")
      $("#GroupRiderInfo").prop("required", false);
    }
  });

  let handlePrimaryPhoto = function (input) {
    if (input.files) {
      let reader = new FileReader();
      reader.onload = function (event) {
        $(".primaryImagePlaceholder")
          .attr("src", event.target.result)
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  $("#input-primary").on("change", function () {
    handlePrimaryPhoto(this, "label#inputPrimaryLabel");
  });

  let handleOptionalPhoto = function (input) {
    if (input.files) {
      let reader = new FileReader();
      reader.onload = function (event) {
        $(".optionalImagePlaceholder")
          .attr("src", event.target.result)
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  $("#input-optional").on("change", function () {
    handleOptionalPhoto(this, "label#inputOptionalLabel");
  });

});
