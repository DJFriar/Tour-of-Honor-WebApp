/**
 * routes/api/riders.js
 *
 * @description:: Handler file for API calls related to riders. All routes with "/api/v1/riders" come through here.
 *
 */

const ApiRiderRouter = require('express').Router();
const { QueryTypes } = require('sequelize');

// const db = require('../../../models');
const { sequelize } = require('../../../models');
const { logger } = require('../../../controllers/logger');
const db = require('../../../models');
const q = require('../../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

ApiRiderRouter.route('/').get(async (req, res) => {
  let RiderDetails;
  try {
    RiderDetails = await q.queryAllUsersWithFlagInfo(currentRallyYear);
  } catch (err) {
    logger.error(`Error encountered: queryAllUsersWithFlagInfo.${err}`, {
      calledFrom: 'api/v1/riders.js',
    });
  }
  res.json(RiderDetails);
});

ApiRiderRouter.route('/inactive').get(async (req, res) => {
  const sqlQuery = `
    SELECT DISTINCT
      u.*, 
      f.FlagNumber 
    FROM Users u 
      INNER JOIN Flags f ON u.id = f.UserID 
    WHERE u.isActive = 0
  `;
  try {
    const InactiveRiders = await sequelize.query(sqlQuery, {
      replacements: [currentRallyYear],
      type: QueryTypes.SELECT,
    });
    res.json(InactiveRiders);
  } catch (err) {
    logger.error(`An error was encountered getting InactiveRiders: ${err}`, {
      calledFrom: 'api/v1/riders.js',
    });
  }
});

// Rider Info by Flag Number
ApiRiderRouter.route('/flag/:flagNumber').get(async (req, res) => {
  const { flagNumber } = req.params;
  const sqlQuery = `
    SELECT 
      f.id, f.FlagNumber, f.UserID, u.FirstName, u.LastName, 
      CONCAT(u.FirstName, ' ', u.LastName) AS FullName 
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
      calledFrom: 'api/v1/riders.js',
    });
    throw err;
  }
});

// Rider / Passenger Pairings
ApiRiderRouter.route('/pairings')
  .get(async (req, res) => {
    const sqlQuery = `
    SELECT DISTINCT
      p.id, p.RiderFlagNumber, p.PassengerFlagNumber, p.RallyYear,
      CONCAT(u1.FirstName, ' ', u1.LastName) AS RiderName, 
      CONCAT(u2.FirstName, ' ', u2.LastName) AS PassengerName
    FROM Passengers p
      LEFT JOIN Flags f1 ON p.RiderFlagNumber = f1.FlagNumber AND f1.RallyYear = ?
      LEFT JOIN Flags f2 ON p.PassengerFlagNumber = f2.FlagNumber AND f2.RallyYear = ?
      LEFT JOIN Users u1 ON f1.UserID = u1.id
      LEFT JOIN Users u2 ON f2.UserID = u2.id
    WHERE p.RallyYear = ?;
    `;
    try {
      const passengerRiderPairings = await sequelize.query(sqlQuery, {
        replacements: [currentRallyYear, currentRallyYear, currentRallyYear],
        type: QueryTypes.SELECT,
      });
      res.json(passengerRiderPairings);
    } catch (err) {
      logger.error(`An error was encountered in passengerRiderPairings`, {
        calledFrom: 'api/v1/riders.js',
      });
      throw err;
    }
  })
  .post(async (req, res) => {
    const { RiderFlagNumber, PassengerFlagNumber } = req.body;

    const NewPairingInfo = {
      RiderFlagNumber,
      PassengerFlagNumber,
      RallyYear: currentRallyYear,
    };

    db.Passenger.create(NewPairingInfo).then(() => {
      res.status(202).send();
    });
  });

ApiRiderRouter.route('/pairings/:pid').delete(async (req, res) => {
  const { pid } = req.params;
  db.Passenger.destroy({
    where: {
      id: pid,
    },
  }).then(() => {
    res.status(202).send();
  });
});

// Rider Info by UserID
ApiRiderRouter.route('/:uid').get(async (req, res) => {
  // const { uid } = req.params;
  // let RiderDetails;
  // try {
  //   RiderDetails = await q.queryAllUsersWithFlagInfo(currentRallyYear);
  // } catch (err) {
  //   logger.error(`Error encountered: queryAllUsersWithFlagInfo.${err}`, { calledFrom: 'api/v1/riders.js' });
  // }
  // res.json(RiderDetails);
  res.status(405).send();
});

module.exports = ApiRiderRouter;
