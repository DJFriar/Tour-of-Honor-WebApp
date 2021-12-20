  $(document).ready(function() {
    $('#memorialTable').DataTable({
      pageLength: 100,
      columns: [
        { "width": "12%" },
        { "width": "30%" },
        { "width": "16%" },
        { "width": "8%" },
        { "width": "8%" },
        null
      ]
    });

    // Handle Bulk Upload Button
    $(".bulkAddMemorialButton").on("click", function(e) {
      e.preventDefault();
      $("#bulkAddMemorialFile").toggleClass("hide-me");
    })

    // Handle csv upload
    var data;
    function handleFileSelect(e) {
      var file=e.target.files[0];
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          data = results;
        }
      });
    }
    $("#csv-file").change(handleFileSelect);

    // Handle Edit Memorial Info Button
    $("#memorialTable").on("click", "editMemorialInfoBtn", function() {
      var id = $(this).data("uid");
      $("#memorialInfoEditModal").css("display","block");
      $(".uk-dropdown").removeClass("uk-open");
      $.ajax("/api/v1/memorial/"+ id, {
        type: "GET",
      }).then(
        function(res) {
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
      )
    })

    // Handle Edit Memorial Text Button
    $(".editMemorialTextBtn").on("click", function() {
      var id = $(this).data("uid");
      $("#memorialTextEditModal").css("display","block");
      $(".uk-dropdown").removeClass("uk-open");
      $.ajax("/api/v1/memorial-text/"+ id, {
        type: "GET",
      }).then(
        function(res) {
          $("#EditMemorialTextID").val(res.id);
          $("#MemorialTextHeading").val(res.Category);
          $("#MemorialText").val(res.Region);
        }
      )
    })

    // Handle add new memorial toggle
    $(".addMemorialButton").on("click", function(e) {
      e.preventDefault();
      $("#editMemorialInfo").toggleClass("hide-me");
      $(".memorialBtnDiv").toggleClass("hide-me");
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
