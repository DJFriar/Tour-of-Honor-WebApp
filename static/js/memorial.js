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
    $("#input-optional").prop("required", false);
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

  $("#isGroupSubmission").change(function() {
    if (this.checked) {
      $("#GroupRiderInfoDiv").removeClass("hide-me")
      $("#GroupRiderInfo").prop("required", true);
    } else {
      $("#GroupRiderInfoDiv").addClass("hide-me")
      $("#GroupRiderInfo").prop("required", false);
    }
  });

  let handlePrimaryPhoto = function (primaryInput) {
    if (primaryInput.files) {
      let reader = new FileReader();
      reader.onload = function (event) {
        $(".primaryImagePlaceholder")
          .attr("src", event.target.result)
      };
      reader.readAsDataURL(primaryInput.files[0]);
    }
  };
  $("#input-primary").on("change", function () {
    handlePrimaryPhoto(this, "label#inputPrimaryLabel");
  });

  let handleOptionalPhoto = function (optionalInput) {
    if (optionalInput.files) {
      let reader = new FileReader();
      reader.onload = function (event) {
        $(".optionalImagePlaceholder")
          .attr("src", event.target.result)
      };
      reader.readAsDataURL(optionalInput.files[0]);
    }
  };
  $("#input-optional").on("change", function () {
    handleOptionalPhoto(this, "label#inputOptionalLabel");
  });

});
