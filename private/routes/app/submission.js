const express = require("express");
const router = express.Router();
const db = require("../../../models");
const { DateTime } = require("luxon");
const fileUpload = require("express-fileupload");
const q = require("../../queries");

// Fetch submissions for given user ID
router.get('/byUser/:id', async (req,res) => {
  const id = req.params.id;
  try {
    var RiderSubmissionHistory = await q.querySubmissionsByRider(id);
  } catch {
    console.log("Error encountered: querySubmissionsByRider");
  }
  res.json(RiderSubmissionHistory);
})

// Submit from Mobile App
router.post('/',
  fileUpload(),
  (req, res) => {
    console.log(req.body.UserID);
    const images = req.files.images;
    const RiderFlag = req.body.RiderFlag;
    const OtherRiders = req.body.OtherRiders;
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

    db.Submission.create({
      UserID: req.body.UserID,
      MemorialID: req.body.MemorialID,
      PrimaryImage: primaryFilename,
      OptionalImage: optionalFilename,
      RiderNotes: req.body.RiderNotes,
      OtherRiders: req.body.OtherRiders,
      Status: 0 // 0 = Pending Approval
    });
    res.send({result:"success"});
  }
);

module.exports = router;
