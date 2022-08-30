// Requiring our models and passport as we've configured it
const db = require("../../../models");
const q = require("../../queries");
const ejs = require("ejs");
const uploadSubmission = require("../../../controllers/uploadSubmission");
const passport = require("../../../config/passport");
const multer = require("multer");
const isAuthenticated = require("../../../config/isAuthenticated");
const sendEmail = require("../../sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { logger } = require("../../../controllers/logger");
const { register } = require("prom-client");
const Shopify = require("shopify-api");
const { generateShopifyCheckout, checkOrderStatusByCheckoutID } = require("../../../controllers/shopify");

const CurrentRallyYear = process.env.CURRENT_RALLY_YEAR;
const OrderingRallyYear = process.env.ORDERING_RALLY_YEAR;

module.exports = function (app) { 

  // Handle Metric Reporting
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  })

  // Handle Sample Image Updates
  app.post("/update-sample-image",
    uploadSubmission.uploadImages,
    uploadSubmission.handleSampleImage, 
    (req, res) => {
      db.Memorial.update({ 
        Code: req.body.EditMemorialCode.toUpperCase(),
        Name: req.body.EditMemorialName,
        Category: req.body.EditMemorialCategory,
        Region: req.body.EditMemorialRegion,
        Latitude: req.body.EditMemorialLatitude,
        Longitude: req.body.EditMemorialLongitude,
        Address1: req.body.EditMemorialAddress1,
        Address2: req.body.EditMemorialAddress2,
        City: req.body.EditMemorialCity,
        State: req.body.EditMemorialState.toUpperCase(),
        URL: req.body.EditMemorialURL,
        Access: req.body.EditMemorialAccess,
        MultiImage: req.body.EditMultiImage,
        SampleImage: req.body.EditSampleImageName,
        Restrictions: req.body.EditMemorialRestrictions
      }, {
        where: { id: req.body.EditMemorialID }
      }).then(() => {
        res.redirect("/admin/memorial-editor2");
      });
    })

  // Check Flag Number Validity
  app.get("/api/v1/flag/:id", (req,res) => {
    const id = req.params.id;
    db.Flag.findOne({
      where: {
        FlagNum: id,
        RallyYear: 2022
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  })

  // Check Email Validity
  app.get("/api/v1/email/:email", (req,res) => {
    console.log("Email Endpoint hit");
    const email = req.params.email;
    db.User.findOne({
      where: {
        Email: email
      }
    }).then(function (dbPost) {
      console.log("==== Email Check ====");
      console.log(dbPost);
      res.json(dbPost);
    });
  })

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
      URL: req.body.MemorialURL,
      Access: req.body.MemorialAccess,
      MultiImage: req.body.MultiImage,
      SampleImage: req.body.SampleImage,
      Restrictions: req.body.MemorialRestrictions,
      RallyYear: 2022,
    }).then(() => {
      res.redirect("/admin/memorial-editor");
    });
  });

  // Create a Memorial - Alternate Version
  app.post("/api/v1/memorial2", (req, res) => {
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
      URL: req.body.MemorialURL,
      Access: req.body.MemorialAccess,
      MultiImage: req.body.MultiImage,
      SampleImage: req.body.SampleImage,
      Restrictions: req.body.MemorialRestrictions,
      RallyYear: 2022,
    }).then(() => {
      res.redirect("/admin/memorial-editor2");
    });
  });

  // Fetch a Memorial by ID
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

    // Fetch a Memorial by Code
    app.get("/api/v1/memorial/c/:code", (req, res) => {
      const code = req.params.code;
      db.Memorial.findOne({
        where: {
          Code: code
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
      URL: req.body.URL,
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
    }).then(function (memorialMetaText) {
      res.json(memorialMetaText);
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
      .then((x) => {
        db.Flag.create({
          FlagNum: req.body.FlagNumber,
          UserID: x.id,
          RallyYear: 2022,
        })
        .then((y) => {
          console.log("User Created Successfully");
          res.status(202).json(y);
        })
      })
      .catch(err => {
        logger.error("Signup API Error Encountered" + err);
        res.status(401).json(err);
      });
  });

  // Send welcome email to newly registered email
  app.post("/api/v1/welcomeemail", async (req, res) => {
    const UserName = req.body.UserName
    try {
      const WelcomeLink = `${process.env.BASE_URL}/welcome/${UserName}`;
      const ScoringPortalLink = `${process.env.BASE_URL}`;
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
        URL: WelcomeLink,
        PortalURL: ScoringPortalLink
      })
      await sendEmail(req.body.Email, "Welcome to the Tour of Honor [IMPORTANT, PLEASE READ]", emailBody);
      res.send("Welcome Email Sent");
    } catch (err) {
      logger.error("An error occured while sending the welcome email: " + err);
      res.send("An error occurred while sending welcome email.");
    }
  })

  // Send a portal sign up email
  app.post("/api/v1/portalemail", async (req, res) => {
    const UserName = req.body.UserName
    try {
      const WelcomeLink = `${process.env.BASE_URL}/welcome/${UserName}`;
      const ScoringPortalLink = `${process.env.BASE_URL}`;
      let emailBody = await ejs.renderFile("./views/emails/emailProfileRegistration.ejs", {
        FirstName: req.body.FirstName,
        Email: req.body.Email,
        FlagNumber: req.body.FlagNumber,
        URL: WelcomeLink,
        PortalURL: ScoringPortalLink
      })
      await sendEmail(req.body.Email, "Tour of Honor Scoring Portal Registration [IMPORTANT, PLEASE READ]", emailBody);
      res.send("Portal Email Sent");
    } catch (error) {
      res.send("An error occurred while sending portal email.");
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
      City: req.body.City,
      State: req.body.State,
      Password: encryptedPassword
    }, {
      where: { id: req.body.UserID }
    }).then(() => {
      console.log("User Onboarded Successfully");
      res.status(200).send();
    })
    .catch(err => {
      logger.error("Rider Onboarding Error Encountered: " + err);
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
    } catch (err) {
      res.send("An error occurred while resetting user's password.");
      console.log(err);
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
      isAdmin: req.user.isAdmin,
      isActive: req.user.isActive
    });
  });

  // Handle New Signup
  app.post("/api/v1/newuser", (req, res) => {
    db.User.create({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      UserName: req.body.UserName,
      FlagNumber: 0, // REMOVE THIS AFTER 2022 RALLY
      Email: req.body.Email.toLowerCase(),
      Password: req.body.Password,
      Address1: req.body.Address1,
      Address2: req.body.Address2,
      City: req.body.City,
      State: req.body.State,
      ZipCode: req.body.ZipCode,
      isAdmin: 0,
      isActive: 0
    }).then((u) => {
      logger.info("New User Created Successfully");
      res.status(202).send();
    }).catch(err => {
      logger.error("Signup API Error Encountered" + err);
      res.status(401).json(err);
    });
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

  // Update a Bike
  app.put("/api/v1/bike", (req, res) => {
    db.Bike.update({
      BikeName: req.body.BikeName,
      Year: req.body.BikeYear,
      Make: req.body.BikeMake,
      Model: req.body.BikeModel,
    }, {
      where: { id: req.body.BikeID }
    }).then(() => {
      res.status(202).send();
    });
  });

  // Get all bikes
  app.get("/api/v1/bikes", function (req, res) {
    db.Bike.findAll({}).then(function (bikeArray) {
      res.json(bikeArray);
    });
  });

  // Get a specific bike
  app.get("/api/v1/bike/:id", function(req, res) {
    const id = req.params.id;
    db.Bike.findOne({
      where: { id: id }
    }).then(function(bikeInfo) {
      res.json(bikeInfo);
    });
  });

  // Delete a bike
  app.delete("/api/v1/bike/:id", function(req, res) {
    const id = req.params.id;
    db.Bike.destroy({
      where: { id: id }
    }).then(() => {
      res.status(202).send();
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
    async function (req, res) {
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
        Source: req.body.Source,
        Status: 0 // 0 = Pending Approval
      })
      res.redirect("/memorials");
    }
  );

  // Handle Manual Entry
  app.put("/handle-alt-entry", async (req, res) => {
    const memCode = req.body.MemorialCode;
    var memID = 0;
    try {
      var memIDResponse = await q.queryMemorialIDbyMemCode(memCode);
      memID = memIDResponse[0].id;
    } catch (err) {
      console.log("Error encountered when getting memorial ID.");
    }
    if(memID > 0) {
      db.EarnedMemorialsXref.create({
        FlagNum: req.body.FlagNumber,
        MemorialID: memID,
        RallyYear: 2022
      });
    }
    res.send("success");
  })

  // Update submissions
  app.put("/handle-submission", function (req, res) {
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

  // POTM Submission
  app.put("/handle-potmSubmission", async (req, res) => {
    const SubID = req.body.SubmissionID

    // Send an email for POTM suggestion.
    const SubmissionLink = `${process.env.BASE_URL}/submission/${SubID}/`;
    let emailBody = await ejs.renderFile("./views/emails/emailPOTMSuggestion.ejs", { URL: SubmissionLink })
    await sendEmail("potm@tourofhonor.com", "Tour of Honor Scoring Team - POTM Suggestion", emailBody);
    res.send("POTM Suggestion has been sent.");
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
      Address1: req.body.Address1,
      Address2: req.body.Address2,
      City: req.body.City,
      State: req.body.State,
      ZipCode: req.body.ZipCode,
      isAdmin: req.body.isAdmin
    }, {
      where: { id: req.body.UserID }
    });
    res.send("success");
  })

  // Handle Address Update
  app.put("/api/v1/saveAddress", function (req, res) {
    db.User.update({
      Address1: req.body.Address1
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

  // Find rider by flag number
  app.get("/api/v1/lookupRiderByFlag/:flag", (req, res) => {
    const flag = req.params.flag;
    db.User.findOne({
      where: {
        FlagNumber: flag
      }
    }).then(function (dbPost) {
      console.log("==== lookupRiderByFlag ====");
      console.log(dbPost);
      res.json(dbPost);
    });
  })

  // Fetch Next Submission ID
  app.get("/api/v1/submission/:category", async (req, res) => {
    const category = req.params.category.toLowerCase();
    try {
      var NextPendingSubmission = await q.queryNextPendingSubmissions(category);
    } catch (err) {
      console.log("Error encountered: queryNextPendingSubmissions." + err);
    }
    res.json(NextPendingSubmission);
  })

  // Handle Trophy Awards
  app.put("/api/v1/award-trophy", async (req, res) => {
    db.Trophy.update({
      FlagNumbers: req.body.FlagNumbers
    }, {
      where: { 
        RegionID: req.body.RegionID,
        PlaceNum: req.body.TrophyPlace
      }
    })
    res.send("success");
  });

  // Handle Granting Awards
  app.put("/api/v1/award-iba", async (req, res) => {
    db.Award.create({
      FlagNum: req.body.FlagNumber,
      Name: req.body.AwardName,
      RideDate: req.body.AwardDate,
      RallyYear: 2022
    })
    res.send("success");
  });

  // Delete an Award
  app.delete("/api/v1/award-iba/:id", (req, res) => {
    var id = req.params.id;
    db.Award.destroy({
      where: {
        id: id
      }
    }).then(() => {
      res.status(202).send();
    });
  })

  // Lookup Orders by RiderID
  app.get("/api/v1/lookupOrderByUserID/:id", (req, res) => {
    var id = req.params.id;
    db.Orders.findOne({
      where: {
        id: id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  })

  // Handle Registration Flow
  app.post("/api/v1/regFlow", async (req, res) => {
    var RegStep = req.body.RegStep;

    if (RegStep == "Rider") {
      console.log(RegStep + " step entered.");
      console.log("UserID = " + req.body.UserID);
      db.Order.create({
        UserID: req.body.UserID,
        NextStepNum: 1
      }).then((o) => {
        logger.info("Order " + o.id + " created.");
        res.status(200).send();
      }).catch(err => {
        logger.error("Error creating order: " + err);
        res.status(401).json(err);
      });
    }

    if (RegStep == "Bike") {
      console.log(RegStep + " step entered.");
      db.Order.update({
        NextStepNum: 2
      },{
        where: {
          RallyYear: 2023,
          UserID: req.body.UserID
        }
      }).then(() => {
        res.status(200).send();
      }).catch(err => {
        logger.error("Error updating order with bike info: " + err);
        res.status(401).json(err);
      })
    }

    if (RegStep == "Passenger") {
      console.log(RegStep + " step entered.");
      db.Order.update({
        PassUserID: req.body.PassUserID,
        NextStepNum: 3
      },{
        where: {
          RallyYear: 2023,
          UserID: req.body.UserID
        }
      }).then(() => {
        res.status(200).send();
      }).catch(err => {
        logger.error("Error updating order with passenger info: " + err);
        res.status(401).json(err);
      })
    }

    if (RegStep == "NewPassenger") {
      console.log(RegStep + " step entered.");

    }

    if (RegStep == "Charity") {
      console.log(RegStep + " step entered.");
      db.Order.update({
        CharityChosen: req.body.CharityChoice,
        NextStepNum: 4
      },{
        where: {
          RallyYear: 2023,
          UserID: req.body.UserID
        }
      }).then(() => {
        res.status(200).send();
      }).catch(err => {
        logger.error("Error updating order with charity info: " + err);
        res.status(401).json(err);
      })
    }

    if (RegStep == "Shirts") {
      console.log(RegStep + " step entered.");
      console.log(req.body);
      var BaseRiderRateObject = await q.queryBaseRiderRate();
      var BaseRiderRate = parseInt(BaseRiderRateObject[0].Price);
      var PassengerSurchargeObject = await q.queryPassengerSurcharge();
      var PassengerSurcharge = parseInt(PassengerSurchargeObject[0].iValue);
      var ShirtSizeSurchargeObject = await q.queryShirtSizeSurcharge();
      var ShirtSizeSurcharge = parseInt(ShirtSizeSurchargeObject[0].iValue);
      var ShirtStyleSurchargeObject = await q.queryShirtStyleSurcharge();
      var ShirtStyleSurcharge = parseInt(ShirtStyleSurchargeObject[0].iValue);
      var totalPrice = BaseRiderRate;
      var ShirtSize = req.body.ShirtSize;
      var ShirtStyle = req.body.ShirtStyle;
      var PassShirtSize = req.body.PassShirtSize;
      var PassShirtStyle = req.body.PassShirtStyle;
      var ShirtSizesToSurcharge = ["2X", "3X", "4X", "5X"];
      var ShirtStylesToSurcharge = ["Long-Sleeved","Ladies Short-Sleeved"]

      var ShirtDetails = {
        ShirtSize,
        ShirtStyle,
        NextStepNum: 5,
      }

      console.log("Subtotal = $" + totalPrice);

      if(ShirtStylesToSurcharge.includes(ShirtStyle)) {
        console.log("Adding Rider Style Surcharge");
        totalPrice += ShirtStyleSurcharge;
        console.log("Subtotal = $" + totalPrice);
      }

      if(ShirtSizesToSurcharge.includes(ShirtSize)) {
        console.log("Adding Rider Size Surcharge");
        totalPrice += ShirtSizeSurcharge;
        console.log("Subtotal = $" + totalPrice);
      }

      if (req.body.hasPass == "true") {
        console.log("Order has Passenger");

        totalPrice += PassengerSurcharge;
        console.log("Subtotal = $" + totalPrice);
        ShirtDetails.PassShirtSize = PassShirtSize;
        ShirtDetails.PassShirtStyle = PassShirtStyle;
        if(ShirtStylesToSurcharge.includes(PassShirtStyle)) {
          console.log("Adding Passenger Style Surcharge");
          totalPrice += ShirtStyleSurcharge;
          console.log("Subtotal = $" + totalPrice);
        }
        if(ShirtSizesToSurcharge.includes(PassShirtSize)) {
          console.log("Adding Passenger Size Surcharge");
          totalPrice += ShirtSizeSurcharge;
          console.log("Subtotal = $" + totalPrice);
        }
      }

      console.log("==== Total Cost ====");
      console.log("Total Cost = $" + totalPrice);

      var PriceTierObject = await q.queryTierByPrice(totalPrice);
      var PriceTier = parseInt(PriceTierObject[0].Tier);
      var ShopifyVariantID = PriceTierObject[0].ShopifyVariantID;
      ShirtDetails.PriceTier = PriceTier;

      // Generate the Shopify URL & ID
      var checkoutDetails = await generateShopifyCheckout(ShopifyVariantID);
      ShirtDetails.CheckoutURL = checkoutDetails.CheckoutURL;
      ShirtDetails.CheckoutID = checkoutDetails.CheckoutID;

      // Update Order with the shirt details
      db.Order.update(ShirtDetails, {
        where: {
          RallyYear: 2023,
          UserID: req.body.UserID
        }
      }).then(() => {
        res.status(200).send({checkoutURL, PriceTier, ShopifyVariantID, totalPrice});
      }).catch(err => {
        logger.error("Error updating order with t-shirt info: " + err);
        res.status(401).json(err);
      })

    }

    if (RegStep == "Payment") {
      console.log(RegStep + " step entered.");
      res.send("success");
    }

    if (RegStep == "Waiver") {
      console.log(RegStep + " step entered.");
      res.send("success");
    }

    if (RegStep == "Flags") {
      console.log(RegStep + " step entered.");
      res.send("success");
    }

  })

  // Check Order Status for a given Rider
  app.get("/api/v1/checkOrderStatus/:id", async (req, res) => {
    const id = req.params.id;
    db.Order.findOne({
      where: {
        UserID: id
      }
    }).then(async function (o) {
      if (o.OrderNumber === null) {
        console.log("OrderNumber not found locally, checking Shopify...");
        // Check Shopify for an Order Number
        var orderNumber = await checkOrderStatusByCheckoutID(o.CheckoutID);
        db.Order.update({
          OrderNumber: orderNumber,
          NextStepNum: 6
        }, {
          where: {
            RallyYear: 2023,
            UserID: id
          }
        }).then(() => {
          console.info("OrderNumber updated for rider " + id);
          res.json(orderNumber);
        });
      }
      if (o.OrderNumber) {
        console.log("OrderNumber Found: " + o.OrderNumber);
        res.json(o.OrderNumber);
      }
    });
  });

  // Get all orders
  app.get("/api/v1/orders", async (req, res) => {
    console.log("Orders API Endpoint hit!");
    try {
      var OrderDetails = await q.queryAllOrdersWithDetail();
      console.log("==== OrderDetails ====");
      console.log(OrderDetails);
    } catch (err) {
      console.log("Error encountered: queryAllOrdersWithDetail." + err);
    }
    res.json(OrderDetails);
  });

  // Save New Charity
  app.post("/api/v1/charity", (req, res) => {
    db.Charity.create({
      RallyYear: req.body.RallyYear,
      Name: req.body.CharityName,
      URL: req.body.CharityURL,
    }).then((c) => {
      logger.info("Charity " + c.id + " created.");
      res.status(200).send();
    }).catch(err => {
      logger.error("Error creating charity: " + err);
      res.status(401).json(err);
    });
  })

  // Delete a Charity
  app.post("/api/v1/charity/:id", (req, res) => {
    const charityid = req.params.id;

    db.Charity.destroy({
      where: { id : charityid }
    }).then(() => {
      res.status(202).send();
    });
  })
}