/* eslint-disable camelcase */
/**
 * routes/api/submission.js
 *
 * @description:: Handler file for API calls related to submissions. All routes with "/api/v1/submission" come through here.
 *
 */

/* eslint-disable prefer-destructuring */
const ApiSubmissionRouter = require('express').Router();
const { QueryTypes } = require('sequelize');
const { DateTime } = require('luxon');
const sharp = require('sharp');
const fileUpload = require('express-fileupload');

const db = require('../../../models');
const { uploadRiderSubmittedImage } = require('../../../controllers/s3');
const { logger } = require('../../../controllers/logger');

const { sequelize } = db;
const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

// Submit from Mobile App
ApiSubmissionRouter.route('/').post(fileUpload(), (req, res) => {
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
    logger.error('No files were uploaded', { calledFrom: 'api/v1/submission.js' });
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
  try {
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
  } catch (err) {
    logger.error(`Error creating Submission in database: ${err}`, {
      calledFrom: 'api/v1/submission.js',
    });
    return res.status(500).send(err);
  }

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
      logger.debug(s3result, { calledFrom: 'api/v1/submission.js' });
    } catch (err) {
      logger.error(`S3 Upload Failed: ${err}`, { calledFrom: 'api/v1/submission.js' });
    }
  }
});

// Fetch submissions for given user ID
ApiSubmissionRouter.route('/byUser/:id').get(async (req, res) => {
  const userId = req.params.id;
  const sqlQuery = `
  SELECT 
    s.id, s.UserId, s.MemorialID, s.Status AS 'StatusID', 
    CASE s.Status 
      WHEN 1 THEN 'Approved' 
      WHEN 2 THEN 'Rejected' 
      WHEN 3 THEN 'In Review' 
      ELSE 'Pending' 
    END Status, 
    s.ScorerNotes, s.RiderNotes, s.createdAt, s.Source,
    m.Code, m.Name, 
    c.Name AS Category 
  FROM Submissions s 
    LEFT JOIN Memorials m ON m.id = s.MemorialID 
    LEFT JOIN Categories c ON c.id = m.Category 
  WHERE s.UserID = ? 
    AND s.createdAt > '2025-01-01' 
  ORDER BY s.createdAt DESC
  `;
  try {
    const pendingSubmissionsForUser = await sequelize.query(sqlQuery, {
      replacements: [userId],
      type: QueryTypes.SELECT,
    });
    res.json(pendingSubmissionsForUser);
  } catch (err) {
    logger.error(`An error was encountered in pendingSubmissionsForUser: ${err}`, {
      calledFrom: 'api/v1/submission.js',
    });
    throw err;
  }
});

// Get All Pending Submissions
ApiSubmissionRouter.route('/pendingHeld').get(async (req, res) => {
  logger.info(`/submission/pendingHeld route was hit`);
  const sqlQuery = `
  SELECT DISTINCT
    s.*, 
    u.FirstName, u.LastName, u.Email,
    f.FlagNumber,  
    m.Name, m.Code, m.Category, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, 
    c.Name AS CatName, 
    CASE s.Status
      WHEN 0 THEN 'Pending' 
      WHEN 1 THEN 'Approved' 
      WHEN 2 THEN 'Rejected' 
      WHEN 3 THEN 'Held' 
    END AS StatusText 
  FROM Submissions s 
    INNER JOIN Users u ON s.UserID = u.id 
    INNER JOIN Memorials m ON s.MemorialID = m.id	
    INNER JOIN Categories c ON m.Category = c.id 
    INNER JOIN Flags f ON f.UserID = u.id AND f.RallyYear = ${currentRallyYear}
  WHERE s.Status IN (0,3)
  `;
  try {
    const allPendingSubmissions = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });
    res.json(allPendingSubmissions);
  } catch (err) {
    logger.error(`An error was encountered in allPendingSubmissions: ${err}`, {
      calledFrom: 'api/v1/submission.js',
    });
    throw err;
  }
});

// Get Only Pending Submissions
ApiSubmissionRouter.route('/pending').get(async (req, res) => {
  const sqlQuery = `
  SELECT DISTINCT
    s.*, 
    u.FirstName, u.LastName, u.Email,
    f.FlagNumber,  
    m.Name, m.Code, m.Category, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, 
    c.Name AS CatName, 
    CASE s.Status
      WHEN 0 THEN 'Pending' 
      WHEN 1 THEN 'Approved' 
      WHEN 2 THEN 'Rejected' 
      WHEN 3 THEN 'Held' 
    END AS StatusText 
  FROM Submissions s 
    INNER JOIN Users u ON s.UserID = u.id 
    INNER JOIN Memorials m ON s.MemorialID = m.id	
    INNER JOIN Categories c ON m.Category = c.id 
    INNER JOIN Flags f ON f.UserID = u.id AND f.RallyYear = ${currentRallyYear}
  WHERE s.Status = 0
  `;
  try {
    const onlyPendingSubmissions = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });
    res.json(onlyPendingSubmissions);
  } catch (err) {
    logger.error(`An error was encountered in onlyPendingSubmissions: ${err}`, {
      calledFrom: 'api/v1/submission.js',
    });
    throw err;
  }
});

// Get Only Held Submissions
ApiSubmissionRouter.route('/held').get(async (req, res) => {
  const sqlQuery = `
  SELECT DISTINCT
    s.*, 
    u.FirstName, u.LastName, u.Email,
    f.FlagNumber,  
    m.Name, m.Code, m.Category, m.Region, m.Latitude, m.Longitude, m.City, m.State, m.SampleImage, m.Access, m.MultiImage, 
    c.Name AS CatName, 
    CASE 
      WHEN s.Status = 0 THEN 'Pending' 
      WHEN s.Status = 1 THEN 'Approved' 
      WHEN s.Status = 2 THEN 'Rejected' 
      WHEN s.Status = 3 THEN 'Held' 
    END AS StatusText 
  FROM Submissions s 
    INNER JOIN Users u ON s.UserID = u.id 
    INNER JOIN Memorials m ON s.MemorialID = m.id	
    INNER JOIN Categories c ON m.Category = c.id 
    INNER JOIN Flags f ON f.UserID = u.id AND f.RallyYear = ${currentRallyYear}
  WHERE s.Status = 3
  `;
  try {
    const onlyHeldSubmissions = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });
    res.json(onlyHeldSubmissions);
  } catch (err) {
    logger.error(`An error was encountered in onlyHeldSubmissions: ${err}`, {
      calledFrom: 'api/v1/submission.js',
    });
    throw err;
  }
});

// Get All Scored Submissions
ApiSubmissionRouter.route('/scored/:year').get(async (req, res) => {
  const scoredYear = req.params.year;
  const sqlQuery = `
  SELECT DISTINCT 
    s.id, s.Status, s.Source, s.createdAt, s.updatedAt, s.ScorerNotes, s.RiderNotes, s.OtherRiders,
    u.FirstName, u.LastName, f.FlagNumber, 
    m.Code, m.Region, m.Latitude, m.Longitude, m.City, m.State, 
    c.Name AS CatName
  FROM Submissions s 
    INNER JOIN Flags f ON f.UserID = s.UserID AND f.RallyYear = ${currentRallyYear}
    INNER JOIN Users u ON s.UserID = u.id
    INNER JOIN Memorials m ON s.MemorialID = m.id	
    INNER JOIN Categories c ON m.Category = c.id 
  WHERE s.Status IN (1,2)
    AND YEAR(s.createdAt) = ? 
  `;
  try {
    const allScoredSubmissions = await sequelize.query(sqlQuery, {
      replacements: [scoredYear],
      type: QueryTypes.SELECT,
    });
    res.json(allScoredSubmissions);
  } catch (err) {
    logger.error(`An error was encountered in allScoredSubmissions: ${err}`, {
      calledFrom: 'api/v1/submission.js',
    });
    throw err;
  }
});

// Fetch Next Submission ID
ApiSubmissionRouter.route('/:category/:sid').get(async (req, res) => {
  const category = req.params.category.toLowerCase();
  const submissionID = req.params.sid;
  const sqlQueryAll = `SELECT id FROM Submissions WHERE Status = 0 AND id > ? ORDER BY id ASC LIMIT 1`;
  const sqlQuery = `
    SELECT s.id 
    FROM Submissions s 
      INNER JOIN Memorials m ON s.MemorialID = m.id 
      INNER JOIN Categories c ON m.Category = c.id 
    WHERE c.Name = ?
      AND s.Status = 0 
      AND s.id > ?
    ORDER BY s.id ASC 
    LIMIT 1
  `;
  try {
    const NextPendingSubmission =
      category === 'all'
        ? await sequelize.query(sqlQueryAll, {
          replacements: [submissionID],
          type: QueryTypes.SELECT,
        })
        : await sequelize.query(sqlQuery, {
          replacements: [category, submissionID],
          type: QueryTypes.SELECT,
        });
    console.log(
      `=== Category = ${category} / sqlQuery = ${category === 'all' ? sqlQueryAll : sqlQuery} ===`,
    );
    console.log(`=== NextPendingSubmission from SQL is`, NextPendingSubmission);
    if (NextPendingSubmission.length > 0) {
      res.json(NextPendingSubmission);
    } else {
      res.send([{ id: 0 }]);
    }
  } catch (err) {
    logger.error(`Error encountered: queryNextPendingSubmissions.${err}`, {
      calledFrom: 'be-routes.js',
    });
  }
});

module.exports = ApiSubmissionRouter;
