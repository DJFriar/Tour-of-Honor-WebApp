let handlePrimaryPhoto = function (input, placeToInsertImagePreview) {
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