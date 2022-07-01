const express = require("express");
const router = express.Router();
const db = require("../../../models");
const { DateTime } = require("luxon");
const sharp = require("sharp");
const fileUpload = require("express-fileupload");
const q = require("../../queries");
const { uploadFile } = require('../../../controllers/s3');


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
    const images = req.files.images;
    const RiderFlag = req.body.RiderFlag;
    RiderArray = [];
    let primaryFile = {};
    const MemorialCode = req.body.MemorialCode;
    const currentTimestamp = DateTime.now().toMillis(); 
    const primaryFilename = `${RiderFlag}-${MemorialCode}-${currentTimestamp}-1.jpg`;
    const optionalFilename = `${RiderFlag}-${MemorialCode}-${currentTimestamp}-2.jpg`;

    if (req.body.OtherRiders != "undefined" && req.body.OtherRiders != "") {
      GroupRiders = req.body.OtherRiders;
      GroupRiderArray = GroupRiders.split(',');
      RiderArray = RiderArray.concat(GroupRiderArray);
    }

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

    try {
      const primaryImageFileData = primaryFile.data;
      shrinkImage(primaryFilename, primaryImageFileData);
    } catch (err) {
      console.log("Error shrinking primary image: " + err)
      return res.status(500).send(err);
    }

    // Handle the optional image
    if (images.length > 1) {
      try {
        const optionalImageFileData = images[1].data;
        shrinkImage(optionalFilename, optionalImageFileData);
      } catch (err) {
        console.log("Error shrinking optional image: " + err)
        return res.status(500).send(err);
      }
    }

    // Save entry to the DB
    db.Submission.create({
      UserID: req.body.UserID,
      MemorialID: req.body.MemorialID,
      PrimaryImage: primaryFilename,
      OptionalImage: optionalFilename,
      RiderNotes: req.body.RiderNotes,
      OtherRiders: RiderArray.toString(),
      Source: req.body.Source,
      Status: 0 // 0 = Pending Approval
    });

    // Respond back to device that all is well
    res.send({result:"success"});

    // FUNCTIONS
    async function shrinkImage(fileName, file) {
      try {
        await sharp(file)
          .toFormat("jpeg")
          .jpeg({ quality: 40 })
          .toBuffer()
          .then(resizedImage => uploadToS3(fileName, resizedImage))
      } catch (err) {
        console.log("shrinkImage failed. " + err)
      }
    }
    
    async function uploadToS3(fileName, file) {
      try {
        const s3result = await uploadFile(fileName, file);
        console.log(s3result);
      } catch (err){
        console.log("S3 Upload Failed: " + err)
      }
    }
  }
);

module.exports = router;
