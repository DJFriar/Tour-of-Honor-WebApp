// Requiring our models and passport as we've configured it
const db = require("../../models");
const uploadSubmission = require("../../controllers/uploadSubmission");
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
      MemorialCode: req.body.MemorialCode,
      MemorialName: req.body.MemorialName,
      MemorialDescription: req.body.MemorialDescription,
      MemorialRequirements: req.body.MemorialRequirements,
      RallyYear: 2021,
    }).then(() => {
      res.status(202).send();
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
  app.put("/api/v1/memorial/:id", function (req, res) {
    db.Memorial.update({ 
      MemorialCode: req.body.MemorialCode,
      MemorialName: req.body.MemorialName,
      MemorialDescription: req.body.MemorialDescription,
      MemorialRequirements: req.body.MemorialRequirements,
      RallyYear: 2021,
    }, {
      where: { id: req.body.memorial_id }
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
      Email: req.body.Email,
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
      db.Submission.create({
        UserID: req.body.UserID,
        MemorialID: req.body.MemorialID,
        PrimaryImage: req.body.images[0],
        OptionalImage: req.body.images[1],
        Status: 0 // 0 = Pending Approval
      })
      res.redirect("/memorials");
    }
  );

  // Update submissions
  app.put("/handle-submission", function (req, res) {
    db.Submission.update({ Status: req.body.Status }, {
      where: { id: req.body.SubmissionID }
    });
    res.send("success");
  })

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
      Email: req.body.Email,
      ZipCode: req.body.ZipCode,
      isAdmin: req.body.isAdmin
    }, {
      where: { id: req.body.UserID }
    });
    res.send("success");
  })
  
}