$(document).ready(function() {
  console.log("==== registration page ready ====");
  // Handle setAddress button
  $("#setAddressButton").on("click", function() {
    $(".modal").css("display","block");
  })

  // Handle Set Address Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Set Address Dialog Cancel Button
  $("#cancelButton").on("click", function() {
    $(".modal").css("display","none");
  })
});


