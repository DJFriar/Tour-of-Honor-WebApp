/**
 * routes/api/flag.js
 *
 * @description:: Handler file for API calls related to flags. All routes with "/api/v1/flag" come through here.
 *
 */

const { _, concat } = require('lodash');
const ApiFlagRouter = require('express').Router();
const { DateTime } = require('luxon');
const { Op } = require('sequelize');

const db = require('../../../models');
const { logger } = require('../../../controllers/logger');
const q = require('../../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;
const rallyYearArray = [];

// logger.info(`==== Current server time is: ${DateTime.now().toISO()}`, {
//   calledFrom: 'api/v1/flag.js',
// });

// Set rally year array to honor prior year flag reservations
if (DateTime.now().toISO() < process.env.RELEASE_UNRESERVED_FLAGS_DATE) {
  logger.debug(`==== Prior Year Flags are: Protected ====`, { calledFrom: 'api/v1/flag.js' });
  rallyYearArray.push(currentRallyYear - 1, currentRallyYear);
} else {
  logger.debug(`==== Prior Year Flags are: Unprotected ====`, { calledFrom: 'api/v1/flag.js' });
  rallyYearArray.push(currentRallyYear);
}

// POST: Flag assignment
ApiFlagRouter.route('/').post((req, res) => {
  logger.debug(`FlagPostAPI entered`);
  db.Flag.create({
    FlagNumber: req.body.FlagNumber,
    UserID: req.body.UserID,
    RallyYear: req.body.RallyYear,
  })
    .then(() => {
      logger.info(`Flag number ${req.body.FlagNumber} assigned to UserID ${req.body.UserID}`, {
        calledFrom: 'api/v1/flag.js',
      });
      res.status(202).send();
    })
    .catch((err) => {
      logger.error(`Error when saving flag number assignments:${err}`, {
        calledFrom: 'api/v1/flag.js',
      });
    });
});

ApiFlagRouter.route('/nextAvailable').get((req, res) => {
  db.Flag.findAll({
    where: {
      RallyYear: {
        [Op.in]: rallyYearArray,
      },
    },
    order: [['FlagNumber', 'ASC']],
    raw: true,
  }).then((flags) => {
    const assignedFlags = flags.map((inUse) => inUse.FlagNumber);
    db.ReservedFlag.findAll({ order: [['FlagNumber', 'ASC']], raw: true }).then(
      (reservedNumbers) => {
        // eslint-disable-next-line prettier/prettier
        const allowedNumbers = _.range(11, 1201, 1); /* range(starting_number, ending_number, increment_by) */
        const reservedFlags = reservedNumbers.map((reserved) => reserved.FlagNumber);
        const badNumbers = concat(assignedFlags, reservedFlags);
        const goodNumbers = _.pullAll(allowedNumbers, badNumbers);
        const nextFlag = _.min(goodNumbers);
        res.json(nextFlag);
      },
    );
  });
});

ApiFlagRouter.route('/nextAvailableAuto').get((req, res) => {
  db.Flag.findAll({
    where: {
      RallyYear: {
        [Op.in]: rallyYearArray,
      },
    },
    order: [['FlagNumber', 'ASC']],
    raw: true,
  }).then((flags) => {
    const assignedFlags = flags.map((inUse) => inUse.FlagNumber);
    db.ReservedFlag.findAll({ order: [['FlagNumber', 'ASC']], raw: true }).then(
      (reservedNumbers) => {
        const allowedNumbers = _.range(3000, 4001, 1);
        const reservedFlags = reservedNumbers.map((reserved) => reserved.FlagNumber);
        const badNumbers = concat(assignedFlags, reservedFlags);
        const goodNumbers = _.pullAll(allowedNumbers, badNumbers);
        const nextAutoFlag = _.min(goodNumbers);
        logger.info(`Next available automotive flag is ${nextAutoFlag}.`, {
          calledFrom: 'api/v1/flag.js',
        });
        res.json(nextAutoFlag);
      },
    );
  });
});

// Handle Flag Reservations
ApiFlagRouter.route('/reservation')
  .get(async (req, res) => {
    let FlagReservations;
    try {
      FlagReservations = await q.queryAllFlagReservations();
    } catch (err) {
      logger.error(`Error encountered: queryAllFlagReservations.${err}`, {
        calledFrom: 'api/v1/flag.js',
      });
    }
    res.json(FlagReservations);
  })
  .post((req, res) => {
    db.ReservedFlag.create({
      FlagNumber: req.body.FlagNumber,
      Notes: req.body.Notes,
      ReservedBy: req.body.ReservedBy,
    }).then(() => {
      res.status(202).send();
    });
  })
  .delete((req, res) => {
    db.ReservedFlag.destroy({
      where: {
        FlagNumber: req.body.FlagNumber,
      },
    }).then(() => {
      res.status(202).send();
    });
  });

// Update Flag Number Assignment
ApiFlagRouter.route('/change').put((req, res) => {
  db.Flag.update(
    {
      FlagNumber: req.body.FlagNumber,
    },
    {
      where: {
        UserID: req.body.RiderID,
        RallyYear: currentRallyYear,
      },
    },
  )
    .then(() => {
      logger.info(`UserID ${req.body.RiderID} was assigned Flag Number ${req.body.FlagNumber}`, {
        calledFrom: 'api/v1/flag.js',
      });
      res.status(202).send();
    })
    .catch((err) => {
      logger.error(`Error when saving flag number updates:${err}`, {
        calledFrom: 'api/v1/flag.js',
      });
    });
});

// GET: Fetch Flag Number details
ApiFlagRouter.route('/:flagNumber').get((req, res) => {
  const { flagNumber } = req.params;
  db.ReservedFlag.findOne({
    where: {
      FlagNumber: flagNumber,
    },
  }).then((flagReserved) => {
    if (flagReserved) {
      res.json(flagReserved);
    } else {
      db.Flag.findOne({
        where: {
          FlagNumber: flagNumber,
          RallyYear: {
            [Op.in]: rallyYearArray,
          },
        },
      }).then((dbPost) => {
        res.json(dbPost);
      });
    }
  });
});

module.exports = ApiFlagRouter;
