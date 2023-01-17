const _ = require('lodash');
const ApiSubmissionRouter = require('express').Router();
const { Op, QueryTypes } = require('sequelize');

const db = require('../../../models');
const { logger } = require('../../../controllers/logger');
const q = require('../../../private/queries');
const { sequelize } = require('../../../models');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

// POST: Create Submission
ApiSubmissionRouter.route('/').post((req, res) => {
  db.Submission.create({
    FlagNumber: req.body.FlagNumber,
    UserID: req.body.UserID,
    RallyYear: req.body.RallyYear,
  })
    .then(() => {
      logger.info(`Flag number ${req.body.FlagNumber} assigned to UserID ${req.body.UserID}`, {
        calledFrom: 'flag.js',
      });
      res.status(202).send();
    })
    .catch((err) => {
      logger.error(`Error when saving flag number assignments:${err}`, { calledFrom: 'flag.js' });
    });
});

// Fetch submissions for given user ID
ApiSubmissionRouter.route('/byUser/:id').get(async (req, res) => {
  const { id } = req.params;
  let RiderSubmissionHistory;
  try {
    RiderSubmissionHistory = await q.querySubmissionsByRider(id);
  } catch (err) {
    logger.error(`Error encountered: querySubmissionsByRider. ${err}`);
  }
  res.json(RiderSubmissionHistory);
});

// Get All Scored Submissions
ApiSubmissionRouter.route('/scored').get(async (req, res) => {
  const sqlQuery = `
  SELECT DISTINCT 
    s.id, s.Status, s.Source, s.createdAt, s.updatedAt, s.ScorerNotes, s.RiderNotes, s.OtherRiders,
    u.FirstName, u.LastName, f.FlagNumber, 
    m.Code, m.Region, m.Latitude, m.Longitude, m.City, m.State, 
    c.Name AS CatName
  FROM Submissions s 
    INNER JOIN Flags f ON f.UserID = s.UserID
    INNER JOIN Users u ON s.UserID = u.id
    INNER JOIN Memorials m ON s.MemorialID = m.id	
    INNER JOIN Categories c ON m.Category = c.id 
  WHERE s.Status IN (1,2)
  `;
  try {
    const allScoredSubmissions = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });
    res.json(allScoredSubmissions);
  } catch (err) {
    logger.error(`An error was encountered in allScoredSubmissions: ${err}`, {
      calledBy: 'api/v1/submission.js',
    });
    throw err;
  }
});

// Find Next Submission to Score
ApiSubmissionRouter.route('/nextAvailable').get((req, res) => {
  db.Submission.findAll({
    where: {
      RallyYear: {
        [Op.in]: currentRallyYear,
      },
    },
    order: [['FlagNumber', 'ASC']],
    raw: true,
  }).then((flags) => {
    const allowedNumbers = _.range(11, 1201, 1);
    const badNumbers = flags.map((inUse) => inUse.FlagNumber);
    const goodNumbers = _.pullAll(allowedNumbers, badNumbers);
    const nextFlag = _.min(goodNumbers);
    res.json(nextFlag);
  });
});

// GET: Fetch Submission details
ApiSubmissionRouter.route('/:id').get((req, res) => {
  const { id } = req.params;
  db.Submission.findOne({
    where: {
      FlagNumber: id,
      RallyYear: {
        [Op.in]: currentRallyYear,
      },
    },
  }).then((dbPost) => {
    res.json(dbPost);
  });
});

module.exports = ApiSubmissionRouter;
