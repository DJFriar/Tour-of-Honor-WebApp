const WebRiderRouter = require('express').Router();

const { logger } = require('../../controllers/logger');
const q = require('../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

WebRiderRouter.route('/').get(async (req, res) => {
  let activeUser = false;
  let riderList;
  let totalEarnedByRider;
  if (req.user) {
    activeUser = true;
  }
  try {
    riderList = await q.queryAllUsersWithFlagInfo(currentRallyYear);
  } catch (err) {
    logger.error(`Error encountered: queryAllUsersWithFlagInfo(${currentRallyYear}).${err}`, {
      calledFrom: 'riders.js',
    });
  }
  try {
    totalEarnedByRider = await q.queryEarnedMemorialsByAllRiders();
  } catch (err) {
    logger.error(`Error encountered: queryEarnedMemorialsByAllRiders().${err}`, {
      calledFrom: 'riders.js',
    });
  }
  res.locals.title = 'TOH Rider List';
  res.render('pages/rider-list', {
    activeUser,
    User: req.user,
    NotificationText: '',
    currentRallyYear,
    riderList,
    totalEarnedByRider,
  });
});

WebRiderRouter.route('/:flag').get(async (req, res) => {
  const flagNumber = req.params.flag;
  const rallyYear = 2022;

  let activeUser = false;
  let earnedCounts;
  let earnedMemorialList;
  let completedStatesList;

  if (req.user) {
    activeUser = true;
  }
  try {
    earnedCounts = await q.queryEarnedMemorialCountByFlag(rallyYear, flagNumber);
  } catch (err) {
    logger.error(
      `Error encountered: queryEarnedMemorialCountByFlag(${rallyYear}, ${flagNumber}).${err}`,
      {
        calledFrom: 'riders.js',
      },
    );
  }
  try {
    earnedMemorialList = await q.queryEarnedMemorialListByFlag(rallyYear, flagNumber);
  } catch (err) {
    logger.error(
      `Error encountered: queryEarnedMemorialListByFlag(${rallyYear}, ${flagNumber}).${err}`,
      {
        calledFrom: 'riders.js',
      },
    );
  }
  try {
    completedStatesList = await q.queryCompletedStatesListByFlag(rallyYear, flagNumber);
  } catch (err) {
    logger.error(
      `Error encountered: queryCompletedStatesListByFlag(${rallyYear}, ${flagNumber}).${err}`,
      {
        calledFrom: 'riders.js',
      },
    );
  }

  res.locals.title = 'TOH Rider Details';
  res.render('pages/rider-detail', {
    activeUser,
    User: req.user,
    NotificationText: '',
    earnedCounts,
    earnedMemorialList,
    completedStatesList,
  });
});

module.exports = WebRiderRouter;
