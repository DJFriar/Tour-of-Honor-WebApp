const express = require('express');

const router = express.Router();

const db = require('../../../models');
const q = require('../../queries');
const { logger } = require('../../../controllers/logger');

const rallyYear = process.env.CURRENT_RALLY_YEAR;

router.get('/', async (req, res) => {
  let ScoringData;
  try {
    ScoringData = await q.queryPendingSubmissionsWithDetails();
  } catch (err) {
    logger.error('Error encountered: queryPendingSubmissionsWithDetails', {
      calledBy: 'scoring.js',
    });
  }
  res.json(ScoringData);
});

// Fetch combined data for a specific Submission
router.get('/data/:id', async (req, res) => {
  const { id } = req.params;
  let ScoringDetailData;
  try {
    ScoringDetailData = await q.queryPendingSubmissions(id);
  } catch (err) {
    logger.error('Error encountered: queryPendingSubmissions', { calledBy: 'scoring.js' });
  }
  res.json(ScoringDetailData);
});

// Check status for a specific Submission
router.get('/status/:id', async (req, res) => {
  const { id } = req.params;
  let ScoringStatus;
  try {
    ScoringStatus = await q.querySubmissionStatusBySubID(id);
  } catch (err) {
    logger.error('Error encountered: querySubmissionStatusBySubID', { calledBy: 'scoring.js' });
  }
  res.json(ScoringStatus);
});

// Scoring Reponse from Mobile App
router.post('/', (req, res) => {
  // Update the submission record to mark it as scored
  db.Submission.update(
    {
      Status: req.body.Status,
      ScorerNotes: req.body.ScorerNotes,
    },
    {
      where: { id: req.body.id },
    },
  );

  // If it was approved, add a record to the EarnedMemorialsXref table to mark it as earned for the appropriate people.
  if (req.body.Status === 1) {
    // Grant credit to the submitter
    db.EarnedMemorialsXref.create({
      FlagNum: req.body.FlagNumber,
      MemorialID: req.body.MemorialID,
      RallyYear: rallyYear,
    });
    // If there are additional participants on the submission then credit them, too.
    if (req.body.OtherRiders) {
      const RiderFlagArray = req.body.OtherRiders.split(',');
      RiderFlagArray.forEach((rider) => {
        db.EarnedMemorialsXref.create({
          FlagNum: rider,
          MemorialID: req.body.MemorialID,
          RallyYear: rallyYear,
        });
      });
    }
  }

  res.send('success');
});

module.exports = router;
