const ApiRiderRouter = require('express').Router();
const { QueryTypes } = require('sequelize');

// const db = require('../../../models');
const { sequelize } = require('../../../models');
const { logger } = require('../../../controllers/logger');
const q = require('../../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

ApiRiderRouter.route('/').get(async (req, res) => {
  let RiderDetails;
  try {
    RiderDetails = await q.queryAllUsersWithFlagInfo(currentRallyYear);
  } catch (err) {
    logger.error(`Error encountered: queryAllUsersWithFlagInfo.${err}`);
  }
  res.json(RiderDetails);
});

// Rider Info by Flag Number
ApiRiderRouter.route('/flag/:flagNumber').get(async (req, res) => {
  const { flagNumber } = req.params;
  const sqlQuery = `
    SELECT f.id, f.FlagNumber, f.UserID, u.FirstName, u.LastName, CONCAT(u.FirstName, ' ', u.LastName) AS FullName 
    FROM Flags f 
      LEFT JOIN Users u ON u.id = f.UserID 
    WHERE f.FlagNumber = ? AND f.RallyYear = ?
  `;
  try {
    const riderInfoByFlagNumber = await sequelize.query(sqlQuery, {
      replacements: [flagNumber, currentRallyYear],
      type: QueryTypes.SELECT,
    });
    res.json(riderInfoByFlagNumber);
  } catch (err) {
    logger.error(`An error was encountered in riderInfoByFlagNumber for Flag #${flagNumber}`, {
      calledBy: 'api/v1/riders.js',
    });
    throw err;
  }
});

// Rider Info by UserID
ApiRiderRouter.route('/:uid').get(async (req, res) => {
  const { uid } = req.params;
  let RiderDetails;
  try {
    RiderDetails = await q.queryAllUsersWithFlagInfo(currentRallyYear);
  } catch (err) {
    logger.error(`Error encountered: queryAllUsersWithFlagInfo.${err}`);
  }
  res.json(RiderDetails);
});

module.exports = ApiRiderRouter;
