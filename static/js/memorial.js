$(document).ready(function() {

  $("#input-primary").bind("change keyup", function () {      
    if ($("#input-primary").val() != "") {
      $(this).closest("form").find(":submit").removeAttr("disabled");
      $("#buttonSpan").removeAttr("uk-tooltip");
    } else {
      $(this).closest("form").find(":submit").attr("disabled", "disabled");      
    }
  });

  $("#isGroupSubmission").change(function() {
    if (this.checked) {
      $("#GroupRiderInfoDiv").removeClass("hide-me")
      $("#GroupRiderInfo").prop("required", true);
    } else {
      $("#GroupRiderInfoDiv").addClass("hide-me")
      $("#GroupRiderInfo").prop("required", false);
    }
  });

  let handlePrimaryPhoto = function (input, placeToInsertImagePreview) {
    if (input.files) {
      let reader = new FileReader();
      reader.onload = function (event) {
        $(".primaryImagePlaceholder")
          .attr("src", event.target.result)
        // $(this).closest("form").find(":submit").removeAttr("disabled");  
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  $("#input-primary").on("change", function () {
    handlePrimaryPhoto(this, "label#inputPrimaryLabel");
  });

  let handleOptionalPhoto = function (input, placeToInsertImagePreview) {
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
