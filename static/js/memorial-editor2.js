$(document).ready(function() {

  // Handle Edit Memorial Info Button
  $("#submitMemorialCodeLookup").on("click", function(e) {
    e.preventDefault();
    console.log("submitMemorialCodeLookup clicked");
    var Code = $("#MemorialCodeLookup").val().trim();

    $.ajax("/api/v1/memorial/c/"+ Code, {
      type: "GET",
    }).then(
      function(res) {
        if (res == undefined || res == null) {
          $("#memorialNotFoundErrorText").toggleClass("hide-me");
        } else if (res.Code == Code) {
          $("#memorialInfoEditModal").css("display","block");
          $(".uk-dropdown").removeClass("uk-open");

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
          $("#EditSampleImage").val(res.SampleImage);
          $("#EditMemorialAccess").val(res.Access);
        } 
        
      }
    )
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
      $("#EditSampleImage").val("imageNeeded.png");
    } else {
      $("#EditSampleImage").val("");
    }
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

  // Handle Save Changes Button
  $("#saveMemorialChangesButton").on("click", function(e) {
    e.preventDefault();
    var id = $("#EditMemorialID").val();
    
    var updateMemorial = {
      MemorialID: id,
      Code: $("#EditMemorialCode").val().trim(),
      Category: $("#EditMemorialCategory").val().trim(),
      Region: $("#EditMemorialRegion").val().trim(),
      Name: $("#EditMemorialName").val().trim(),
      Address1: $("#EditMemorialAddress1").val().trim(),
      Address2: $("#EditMemorialAddress2").val().trim(),
      URL: $("#EditMemorialURL").val().trim(),
      City: $("#EditMemorialCity").val().trim(),
      State: $("#EditMemorialState").val().trim(),
      Latitude: $("#EditMemorialLatitude").val().trim(),
      Longitude: $("#EditMemorialLongitude").val().trim(),
      Restrictions: $("#EditMemorialRestrictions").val().trim(),
      MultiImage: $("#EditMultiImage").val().trim(),
      SampleImage: $("#EditSampleImage").val().trim(),
      Access: $("#EditMemorialAccess").val().trim()
    };
    console.log(updateMemorial);
    $.ajax("/api/v1/memorial/", {
      type: "put",
      data: updateMemorial
    }).then(
      function() {
        location.reload();
      }
    );
  });

});
