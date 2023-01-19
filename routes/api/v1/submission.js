/**
 * routes/api/submission.js
 *
 * @description:: Handler file for API calls related to submissions. All routes with "/api/v1/submission" come through here.
 *
 */

/* eslint-disable prefer-destructuring */
const express = require('express');

const router = express.Router();
const { DateTime } = require('luxon');
const sharp = require('sharp');
const fileUpload = require('express-fileupload');
const db = require('../../../models');
const { uploadRiderSubmittedImage } = require('../../../controllers/s3');
const { logger } = require('../../../controllers/logger');

// Submit from Mobile App
router.post('/', fileUpload(), (req, res) => {
  const { images } = req.files;
  const { RiderFlag } = req.body;
  let RiderArray = [];
  let primaryFile = {};
  const { MemorialCode } = req.body;
  const currentTimestamp = DateTime.now().toMillis();
  const primaryFilename = `${RiderFlag}-${MemorialCode}-${currentTimestamp}-1.jpg`;
  let optionalFilename = 'OptionalImageNotProvided.png';

  if (req.body.OtherRiders !== 'undefined' && req.body.OtherRiders !== '') {
    const GroupRiders = req.body.OtherRiders;
    const GroupRiderArray = GroupRiders.split(',');
    RiderArray = RiderArray.concat(GroupRiderArray);
  }

  if (!req.files) {
    logger.info('No files were uploaded', { calledFrom: 'api/v1/submission.js' });
    return res.status(400).send('No files were uploaded.');
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
    logger.error(`Error shrinking primary image: ${err}`, {
      calledFrom: 'api/v1/submission.js',
    });
    return res.status(500).send(err);
  }

  // Handle the optional image
  if (images.length > 1) {
    optionalFilename = `${RiderFlag}-${MemorialCode}-${currentTimestamp}-2.jpg`;
    try {
      const optionalImageFileData = images[1].data;
      shrinkImage(optionalFilename, optionalImageFileData);
    } catch (err) {
      logger.error(`Error shrinking optional image: ${err}`, {
        calledFrom: 'api/v1/submission.js',
      });
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
    Status: 0, // 0 = Pending Approval
  });

  // Respond back to device that all is well
  return res.send({ result: 'success' });

  // FUNCTIONS
  async function shrinkImage(fileName, file) {
    try {
      await sharp(file)
        .resize(1440, 1440, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .withMetadata()
        .toFormat('jpeg')
        .jpeg()
        .toBuffer()
        .then((resizedImage) => uploadToS3(fileName, resizedImage));
    } catch (err) {
      logger.error(`shrinkImage failed. ${err}`, {
        calledFrom: 'api/v1/submission.js',
      });
    }
  }

  async function uploadToS3(fileName, file) {
    try {
      const s3result = await uploadRiderSubmittedImage(fileName, file);
      logger.info(s3result, { calledFrom: 'api/v1/submission.js' });
    } catch (err) {
      logger.error(`S3 Upload Failed: ${err}`, { calledFrom: 'api/v1/submission.js' });
    }
  }
});

module.exports = router;
