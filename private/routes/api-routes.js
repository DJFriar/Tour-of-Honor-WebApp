const db = require("../../models");
const q = require("../../private/queries");
const { DateTime } = require("luxon");
const fileUpload = require("express-fileupload");

module.exports = function (app) { 
  // Fetch all Memorials
  app.get("/api/v1/memorials/", (req, res) => {
    db.Memorial.findAll({ }).then(function (memorials) {
      res.json(memorials);
    });
  })

  // Fetch Memorial list
  app.get("/api/v1/memorial-list/", async (req, res) => {
    try {
      var MemorialList = await q.queryAllMemorials();
    } catch {
      console.log("Error encountered: queryAllMemorials");
    }
    res.json(MemorialList);
  })

  // Fetch specific Memorial
  app.get("/api/v1/memorials/:id", (req, res) => {
    const id = req.params.id
    db.Memorial.findOne({
      where: {
        id: id
      }
    }).then(function (memorial) {
      res.json(memorial);
    });
  })

  // Fetch combined data for a specific Memorial
  app.get("/api/v1/memorial-data/:id", async (req, res) => {
    const id = req.params.id
    try {
      var MemorialData = await q.queryMemorialData(id);
    } catch {
      console.log("Error encountered: queryMemorialData");
    }
    res.json(MemorialData);
  })

  // Fetch a Memorial Text Entry
  app.get("/api/v1/memorial-text/:id", (req, res) => {
    const id = req.params.id;
    db.MemorialMeta.findAll({
      where: {
        MemorialID: id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  })

  // Fetch all active Categories
  app.get("/api/v1/categories/", (req, res) => {
    db.Category.findAll({
      where: {
        Active: 1
      }
    }).then(function (categories) {
      res.json(categories);
    });
  })

  // Fetch all Users
  app.get("/api/v1/users/", (req, res) => {
    db.User.findAll({ }).then(function (users) {
      res.json(users);
    });
  })

  // Fetch a specific User
  app.get("/api/v1/user/:id", (req, res) => {
    const id = req.params.id;
    db.User.findOne({
      where: {
        id: id
      }
    }).then(function (user) {
      res.json(user);
    });
  })

  // Fetch a specific Restriction
  app.get("/api/v1/restriction/:id", (req, res) => {
    const id = req.params.id;
    db.Restriction.findOne({
      where: {
        id: id
      }
    }).then(function (restriction) {
      res.json(restriction);
    });
  })

  // Submit from Mobile App
  app.post('/api/v1/mobile-submission',
    fileUpload(),
    (req, res) => {
      console.log(req.body.UserID);
      const images = req.files.images;
      const RiderFlag = "714";
      let primaryFile = {};
      const MemorialCode = req.body.MemorialCode;
      const currentTimestamp = DateTime.now().toMillis(); 
      const primaryFilename = `${RiderFlag}-${MemorialCode}-${currentTimestamp}-1.jpg`;
      const optionalFilename = `${RiderFlag}-${MemorialCode}-${currentTimestamp}-2.jpg`;
      if (!req.files) {
        console.log("No files were uploaded");
        return res.status(400).send("No files were uploaded.");
      }

      // Handle the primary image
      if (images.length > 1) {
        primaryFile = images[0];
      } else {
        primaryFile = images;
      }
      const primaryPath = "static/uploads/" + primaryFilename;
      primaryFile.mv(primaryPath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      })
      // Handle the optional image
      if (images.length > 1) {
        const secondaryFile = images[1];
        const secondaryPath = "static/uploads/" + optionalFilename;
        secondaryFile.mv(secondaryPath, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
        })
      }

      const RiderArray = [];
      // PillionFlagNumber = 0;
      // if (req.body.hasPillion) {
      //   PillionFlagNumber = req.user.PillionFlagNumber.toString();
      //   RiderArray.push(PillionFlagNumber);      
      // }
      // if (req.body.isGroupSubmission) {
      //   GroupRiders = req.body.GroupRiderInfo;
      //   GroupRiderArray = GroupRiders.split(',');
      //   RiderArray = RiderArray.concat(GroupRiderArray);
      // }

      // console.log(req);

      db.Submission.create({
        UserID: req.body.UserID,
        MemorialID: req.body.MemorialID,
        PrimaryImage: primaryFilename,
        OptionalImage: optionalFilename,
        RiderNotes: req.body.RiderNotes,
        OtherRiders: RiderArray.toString(),
        Status: 0 // 0 = Pending Approval
      });
      res.send({result:"success"});
    }
  );
}