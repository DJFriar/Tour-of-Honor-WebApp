const express = require("express");
const router = express.Router();
const db = require("../../../models");
const { DateTime } = require("luxon");
const fileUpload = require("express-fileupload");

// Submit from Mobile App
router.post('/',
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

module.exports = router;
