$(document).ready(function() {

  // Handle Edit Memorial Info Button
  $("#submitMemorialCodeLookup").on("click", function(e) {
    e.preventDefault();
    console.log("submitMemorialCodeLookup clicked");
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

  // Handle submitMemorialTextEdit button
  $("#submitMemorialTextEdit").on("click", function(e) {
    e.preventDefault();
    var MemCode = $("#MemorialCodeLookup").val().trim();
    MemCode = MemCode.toUpperCase();
    $(location).attr("href", "/admin/memorial-text/" + MemCode);
  })

  // Handle add new memorial toggle
  $(".addMemorialButton").on("click", function(e) {
    e.preventDefault();
    $("#editMemorialInfo").toggleClass("hide-me");
    $(".memorialBtnDiv").toggleClass("hide-me");
  });

  // Handle Image Needed checkbox
  $("#ImageNeeded").change(function() {
    if (this.checked) {
      $("#SampleImage").val("imageNeeded.png");
    } else {
      $("#SampleImage").val("");
    }
  });
  $("#EditImageNeeded").change(function() {
    if (this.checked) {
      $("#EditSampleImageName").val("imageNeeded.png");
      $(".sampleImagePlaceholder").attr("data-src", "/images/imageNeeded.png");
    } else {
      $(".sampleImagePlaceholder").attr("data-src", baseSampleImageUrl + SampleImage);
      $("#EditSampleImageName").val(SampleImage);
    }
  });

  // Handle sample image upload
  let handleSampleImageFile = function (fileInput) {
    if (fileInput.files) {
      let reader = new FileReader();
      reader.onload = function (event) {
        updatedSampleImage = true;
        $(".sampleImagePlaceholder")
          .attr("data-src", event.target.result)
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  };
  $("#sampleImageFile").on("change", function () {
    handleSampleImageFile(this, "label#inputSampleImageLabel");
  });

  // Handle Delete Memorial Button
  $(".deleteMemorialBtn").on("click", function() {
    var id = $(this).data("uid");
    $.ajax("/api/v1/memorial/" + id, {
      type: "DELETE"
    }).then(
      function() {
        location.reload();
      }
    );
  });

  // Handle Dialog Close Button
  $(".close").on("click", function() {
    $(".modal").css("display","none");
  })

  // Handle Dialog Cancel Button
  $("#cancelButton").on("click", function() {
    $(".modal").css("display","none");
  })

});
