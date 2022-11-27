const ApiRiderRouter = require('express').Router();

const { logger } = require('../../../controllers/logger');
// const db = require('../../../models');
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
  let RiderDetails;
  try {
    RiderDetails = await q.queryRiderInfoByFlag(flagNumber);
  } catch (err) {
    logger.error(`Error encountered: queryRiderInfoByFlag.${err}`);
  }
  res.json(RiderDetails);
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
