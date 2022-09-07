const express = require("express");
const router = express.Router();
const db = require("../../../models");
const q = require("../../queries");
const { logger } = require('../../../controllers/logger');

router.get("/", async (req, res) => {
  try {
    var ScoringData = await q.queryPendingSubmissionsWithDetails();
  } catch(err) {
    console.log("Error encountered: queryPendingSubmissionsWithDetails");
    console.log(err);
  }
  res.json(ScoringData);
})

// Fetch combined data for a specific Submission
router.get("/data/:id", async (req, res) => {
  const id = req.params.id
  try {
    var ScoringDetailData = await q.queryPendingSubmissions(id);
  } catch(err) {
    console.log("Error encountered: queryPendingSubmissions");
    console.log(err);
  }
  res.json(ScoringDetailData);
})

// Check status for a specific Submission
router.get("/status/:id", async (req, res) => {
  const id = req.params.id
  try {
    var ScoringStatus = await q.querySubmissionStatusBySubID(id);
  } catch(err) {
    console.log("Error encountered: querySubmissionStatusBySubID");
    console.log(err);
  }
  res.json(ScoringStatus);
})

// Scoring Reponse from Mobile App
router.post('/', (req, res) => {
  console.info("==== post /scoring endpoint reached ====");
  console.log(req.body);
  
  // Update the submission record to mark it as scored
  db.Submission.update({
    Status: req.body.Status,
    ScorerNotes:  req.body.ScorerNotes,
  }, {
    where: { id: req.body.id }
  });

  // If it was approved, add a record to the EarnedMemorialsXref table to mark it as earned for the appropriate people.
  if(req.body.Status == 1) {
    // Grant credit to the submitter
    db.EarnedMemorialsXref.create({
      FlagNum: req.body.FlagNumber,
      MemorialID: req.body.MemorialID,
      RallyYear: 2022
    });
    // If there are additional participants on the submission then credit them, too.
    if (req.body.OtherRiders) {
      var RiderFlagArray = req.body.OtherRiders.split(",");
      RiderFlagArray.forEach(rider => {
        db.EarnedMemorialsXref.create({
          FlagNum: rider,
          MemorialID: req.body.MemorialID,
          RallyYear: 2022
        });
      });
    }
  }

  res.send("success");
})

module.exports = router;