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

module.exports = ApiRiderRouter;
