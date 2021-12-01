// Requiring our models and passport as we've configured it
const db = require("../../models");
const q = require("../../private/queries");
const ejs = require("ejs");
const uploadSubmission = require("../../controllers/uploadSubmission");
const uploadImages = require("../../controllers/uploadImages");
const passport = require("../../config/passport");
const multer = require('multer');
const isAuthenticated = require("../../config/isAuthenticated");
const upload = multer({ dest: '../static/uploads' });
const sendEmail = require("../sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");


module.exports = function (app) { 
  // 
  // Memorial Info Related
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
      RallyYear: 2022,
    }).then(() => {
      res.redirect("/admin/memorial-editor");
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
  // Memorial Text Related
  //

  // Create a Memorial Text Entry
  app.post("/api/v1/memorial-text", (req, res) => {
    db.MemorialMeta.create({
      MemorialID: req.body.MemorialID,
      Heading: req.body.Heading,
      Text: req.body.Text
    }).then(() => {
      res.redirect('back');
    });
  });

  // Fetch a Memorial Text Entry
  app.get("/api/v1/memorial-text/:id", (req, res) => {
    const id = req.params.id;
    db.MemorialMeta.findOne({
      where: {
        id: id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  })

  // Update a Memorial Text Entry
  app.put("/api/v1/memorial-text", function (req, res) {
    db.MemorialMeta.update({ 
      MemorialID: req.body.MemorialID,
      Heading: req.body.Heading,
      Text: req.body.Text
    }, {
      where: { id: req.body.id }
    });
    res.send("success");
  })

  // Delete a Memorial Text Entry
  app.delete("/api/v1/memorial-text/:id", (req, res) => {
    const id = req.params.id;
    db.MemorialMeta.destroy({
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
    db.User.create({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      UserName: req.body.UserName,
      FlagNumber: req.body.FlagNumber,
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

  app.post("/api/v1/welcomeemail", async (req, res) => {
    const UserName = req.body.UserName
    try {
      // Send the welcome email.
      const WelcomeLink = `${process.env.BASE_URL}/welcome/${UserName}`;
      let emailBody = await ejs.renderFile("./views/emails/emailRiderWelcome.ejs", {
        FirstName: req.body.FirstName,
        Email: req.body.Email,
        FlagNumber: req.body.FlagNumber,
        ShirtStyle: req.body.ShirtStyle,
        ShirtSize: req.body.ShirtSize,
        EmailNotes: req.body.EmailNotes,
        PassengerFirstName: req.body.PassengerFirstName,
        PassengerEmail: req.body.PassengerEmail,
        PassengerFlagNumber: req.body.PassengerFlagNumber,
        PassengerShirtStyle: req.body.PassengerShirtStyle,
        PassengerShirtSize: req.body.PassengerShirtSize,
        URL: WelcomeLink 
      })
      await sendEmail(req.body.Email, "Welcome to the Tour of Honor", emailBody);
      res.send("Welcome Email Sent");
    } catch (error) {
      res.send("An error occurred while sending welcome email.");
      console.log(error);
    }
  })

  // Handle New Rider Onboarding
  app.put("/api/v1/rideronboarding", function (req, res) {
    let Password = req.body.Password;
    const encryptedPassword = bcrypt.hashSync(
        Password,
        bcrypt.genSaltSync(10),
        null
      );
    db.User.update({
      UserName: req.body.UserName,
      ZipCode: req.body.ZipCode,
      Password: encryptedPassword
    }, {
      where: { id: req.body.UserID }
    }).then(() => {
      console.log("User Onboarded Successfully");
      res.status(202).send();
    })
    .catch(err => {
      console.log("Rider Onboarding Error Encountered");
      res.status(401).json(err);
    });
  })

  app.post("/api/v1/resetpasswordrequest", async (req, res) => {
    try {
      // Look for the user in the DB
      const User = await db.User.findOne({ 
        where: { 
          Email: req.body.Email 
        }
      });
      // Error if the user isn't found.
      if (!User) {
        return res.status(400).send("User email not found.");
      }
      // See if a token already exists for the user.
      let ResetToken = await db.ResetToken.findOne({ 
        where: {
          user_id: User.id 
        }
      });
      // If not, create a new token.
      if (!ResetToken) {
        CreateToken = await db.ResetToken.create({
          user_id: User.id,
          Token: crypto.randomBytes(32).toString("hex")
        })
        .then((data) => {
          ResetToken = data;
        })
        .catch(err => {
          console.log("Error creating token");
          res.status(401).json(err);
        })
      }
      // Send the password reset email.
      const PWResetLink = `${process.env.BASE_URL}/forgotpassword/${User.id}/${ResetToken.Token}`;
      let emailBody = await ejs.renderFile("./views/emails/emailPasswordReset.ejs", { URL: PWResetLink })
      await sendEmail(User.Email, "Tour of Honor Scoring Portal - Password Reset Request", emailBody);
      res.send("Password reset link sent to your email account");
    } catch (error) {
      res.send("An error occurred while resetting user's password.");
      console.log(error);
    }
  });

  // Handle User Password Change
  app.put("/api/v1/resetpasswordaction", function (req, res) {
    let Password = req.body.Password;
    const encryptedPassword = bcrypt.hashSync(
        Password,
        bcrypt.genSaltSync(10),
        null
      );
    // Update user's password
    db.User.update({
      Password: encryptedPassword
    }, {
      where: { id: req.body.UserID} 
    });
    // Remove the token that was created.
    db.ResetToken.destroy({
      where: { user_id: req.body.UserID }
    });
    res.send("success");
  })

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
  app.post("/api/v1/bike", (req, res) => {
    db.Bike.create({
      user_id: req.body.UserID,
      BikeName: req.body.BikeName,
      Year: req.body.BikeYear,
      Make: req.body.BikeMake,
      Model: req.body.BikeModel,
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
      RiderArray = [];
      PillionFlagNumber = 0;
      if (req.body.hasPillion) {
        PillionFlagNumber = req.user.PillionFlagNumber.toString();
        RiderArray.push(PillionFlagNumber);      
      }
      if (req.body.isGroupSubmission) {
        GroupRiders = req.body.GroupRiderInfo;
        GroupRiderArray = GroupRiders.split(',');
        RiderArray = RiderArray.concat(GroupRiderArray);
      }
      db.Submission.create({
        UserID: req.user.id,
        MemorialID: req.body.MemorialID,
        PrimaryImage: req.body.images[0],
        OptionalImage: req.body.images[1],
        RiderNotes: req.body.RiderNotes,
        OtherRiders: RiderArray.toString(),
        Status: 0 // 0 = Pending Approval
      })
      res.redirect("/memorials");
    }
  );

  // Update submissions
  app.put("/handle-submission", function (req, res) {
    // Update the submission record to mark it as scored
    // db.Submission.update({
    //   Status: req.body.Status,
    //   ScorerNotes:  req.body.ScorerNotes,
    //   RiderNotes: req.body.RiderNotes
    // }, {
    //   where: { id: req.body.SubmissionID }
    // });
    // If it was approved, add a record to the EarnedMemorialsXref table to mark it as earned for the appropriate people.
    if(req.body.Status == 1) {
      // Grant credit to the submitter
      db.EarnedMemorialsXref.create({
        FlagNum: req.body.SubmittedFlagNumber,
        MemorialID: req.body.SubmittedMemorialID,
        RallyYear: 2022
      });
      // If there are additional participents on the submission then credit them, too.
      if (req.body.SubmittedOtherRiders) {
        var RiderFlagArray = req.body.SubmittedOtherRiders.split(",");
        RiderFlagArray.forEach(rider => {
          db.EarnedMemorialsXref.create({
            FlagNum: rider,
            MemorialID: req.body.SubmittedMemorialID,
            RallyYear: 2022
          });
        });
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