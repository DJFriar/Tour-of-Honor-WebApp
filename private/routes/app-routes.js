// Requiring our models and passport as we've configured it
const db = require("../../models");
const uploadSubmission = require("../../controllers/uploadSubmission");
const uploadImages = require("../../controllers/uploadImages");
const passport = require("../../config/passport");
const multer = require('multer');
const isAuthenticated = require("../../config/isAuthenticated");
const upload = multer({ dest: '../static/uploads' });

module.exports = function (app) { 
  // 
  // Memorial Related
  //

  // Create a Memorial
  app.post("/api/v1/memorial", (req, res) => {
    db.Memorial.create({
      Code: req.body.MemorialCode.toUpperCase(),
      Name: req.body.MemorialName,
      Category: req.body.MemorialCategory,
      Region: req.body.MemorialRegion,
      Latitude: req.body.MemorialLatitude,
      Longitude: req.body.MemorialLongitude,
      Address1: req.body.MemorialAddress1,
      Address2: req.body.MemorialAddress2,
      City: req.body.MemorialCity,
      State: req.body.MemorialState.toUpperCase(),
      URL: req.body.MemorialURL.toLowerCase(),
      Access: req.body.MemorialAccess,
      MultiImage: req.body.MultiImage,
      SampleImage: req.body.SampleImage,
      Restrictions: req.body.MemorialRestrictions,
      RallyYear: 2021,
    }).then(() => {
      // res.status(202).send();
      res.redirect("/admin/aux-memorial-editor");
    });
  });

  // Fetch a Memorial
  app.get("/api/v1/memorial/:id", (req, res) => {
    const id = req.params.id;
    db.Memorial.findOne({
      where: {
        id: id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  })

  // Update a Memorial
  app.put("/api/v1/memorial", function (req, res) {
    db.Memorial.update({ 
      Code: req.body.Code.toUpperCase(),
      Name: req.body.Name,
      Category: req.body.Category,
      Region: req.body.Region,
      Latitude: req.body.Latitude,
      Longitude: req.body.Longitude,
      Address1: req.body.Address1,
      Address2: req.body.Address2,
      City: req.body.City,
      State: req.body.State.toUpperCase(),
      URL: req.body.URL.toLowerCase(),
      Access: req.body.Access,
      MultiImage: req.body.MultiImage,
      SampleImage: req.body.SampleImage,
      Restrictions: req.body.Restrictions
    }, {
      where: { id: req.body.MemorialID }
    });
    res.send("success");
  })

  // Delete a Memorial
  app.delete("/api/v1/memorial/:id", (req, res) => {
    const id = req.params.id;
    db.Memorial.destroy({
      where: {
        id: id
      }
    }).then(() => {
      res.status(202).send();
    });
  });

  // 
  // Authentication Related
  // 

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/v1/user", (req, res) => {
    console.log("user post API hit");
    db.User.create({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      UserName: req.body.UserName,
      Email: req.body.Email.toLowerCase(),
      Password: req.body.Password
    })
      .then(() => {
        console.log("User Created Successfully");
        res.status(202).send();
      })
      .catch(err => {
        console.log("Signup API Error Encountered");
        res.status(401).json(err);
      });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the profile page.
  // Otherwise the user will be sent an error
  app.post("/api/v1/login", passport.authenticate("local"), (req, res) => {
    res.json({
      email: req.user.Email,
      id: req.user.id,
      isAdmin: req.user.isAdmin
    });
  });

    // Route for logging user out
    app.get("/logout", (req, res) => {
      req.logout();
      res.redirect("/");
    });

  // 
  // Bike Related
  // 

  // Create a Bike
  app.post("/api/v1/bike", isAuthenticated, (req, res) => {
    db.Bike.create({
      user_id: req.user.id,
      BikeName: req.body.BikeName,
      Year: req.body.Year,
      Make: req.body.Make,
      Model: req.body.Model,
    }).then(() => {
      res.status(202).send();
    });
  });

  // Get all bikes
  app.get("/api/v1/bikes", function (req, res) {
    db.Bike.findAll({}).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // 
  // Submission Related
  // 

  // Accept the image the user uploaded, resize it and save it.
  app.post('/submit-memorial',
    uploadSubmission.uploadImages,
    uploadSubmission.resizeImages,
    uploadSubmission.getResult,
    function (req, res) {
      PillionFlagNumber = 0;
      if (req.body.hasPillion) {
        console.log("Pillion Detected");
        PillionFlagNumber = req.user.PillionFlagNumber.toString();
      }
      db.Submission.create({
        UserID: req.user.id,
        MemorialID: req.body.MemorialID,
        PrimaryImage: req.body.images[0],
        OptionalImage: req.body.images[1],
        RiderNotes: req.body.RiderNotes,
        OtherRiders: PillionFlagNumber,
        Status: 0 // 0 = Pending Approval
      })
      res.redirect("/memorials");
    }
  );

  // Update submissions
  app.put("/handle-submission", function (req, res) {
    console.log("==== db.Submission.update ====");
    console.log(req.body);
    // Update the submission record to mark it as scored
    db.Submission.update({

      Status: req.body.Status,
      ScorerNotes:  req.body.ScorerNotes,
      RiderNotes: req.body.RiderNotes
    }, {
      where: { id: req.body.SubmissionID }
    });
    // If it was approved, add a record to the EarnedMemorialsXref table to mark it as earned for the appropriate people.
    if(req.body.Status == 1) {
      console.log("==== db.EarnedMemorialsXref.create ====");
      db.EarnedMemorialsXref.create({
        UserID: req.body.SubmittedUserID,
        MemorialID: req.body.SubmittedMemorialID
      });
      if (req.body.SubmittedOtherRiders) {
        console.log("==== Other Riders Detected ====");
        // TODO: Write logic to add records for everyone in the other riders field.
        // db.EarnedMemorialsXref.create({
        //   UserID: req.body.SubmittedOtherRiders,
        //   MemorialID: req.body.SubmittedMemorialID
        // });
      }
    }
    res.send("success");
  })

  // Delete a Submission
  app.delete("/handle-submission/:id", (req, res) => {
    const id = req.params.id;
    db.Submission.destroy({
      where: {
        id: id
      }
    }).then(() => {
      res.status(202).send();
    });
  });

  // 
  // Profile Related
  // 

  // Handle Profile Updates
  app.put("/api/v1/user", function (req, res) {
    db.User.update({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      UserName: req.body.UserName,
      FlagNumber: req.body.FlagNumber,
      PillionFlagNumber: req.body.PillionFlagNumber,
      Email: req.body.Email,
      ZipCode: req.body.ZipCode,
      isAdmin: req.body.isAdmin
    }, {
      where: { id: req.body.UserID }
    });
    res.send("success");
  })

    // Delete a User
    app.delete("/api/v1/user/:id", (req, res) => {
      const id = req.params.id;
      db.User.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.status(202).send();
      });
    });

  // Fetch a User
  app.get("/api/v1/user/:id", (req, res) => {
    const id = req.params.id;
    db.User.findOne({
      where: {
        id: id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  })
  
}