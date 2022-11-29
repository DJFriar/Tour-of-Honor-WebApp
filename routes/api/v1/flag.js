const _ = require('lodash');
const ApiFlagRouter = require('express').Router();
const { DateTime } = require('luxon');
const { Op } = require('sequelize');

const db = require('../../../models');
const { logger } = require('../../../controllers/logger');
const q = require('../../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;
const rallyYearArray = [];

// Set rally year array to honor prior year flag reservations
if (DateTime.now().toISO() < process.env.RELEASE_UNRESERVED_FLAGS_DATE) {
  rallyYearArray.push(currentRallyYear - 1, currentRallyYear);
} else {
  rallyYearArray.push(currentRallyYear);
}

// POST: Flag assignment
ApiFlagRouter.route('/').post((req, res) => {
  logger.debug('FlagPostAPI entered');
  db.Flag.create({
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

// Find Next Available Flag Number
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
    const allowedNumbers = _.range(11, 1201, 1);
    const badNumbers = flags.map((inUse) => inUse.FlagNumber);
    const goodNumbers = _.pullAll(allowedNumbers, badNumbers);
    const nextFlag = _.min(goodNumbers);
    res.json(nextFlag);
  });
});

// Handle Flag Reservations
ApiFlagRouter.route('/reservation')
  .get(async (req, res) => {
    let FlagReservations;
    try {
      FlagReservations = await q.queryAllFlagReservations();
    } catch (err) {
      logger.error(`Error encountered: queryAllFlagReservations.${err}`);
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
        calledFrom: 'flag.js',
      });
      res.status(202).send();
    })
    .catch((err) => {
      logger.error(`Error when saving flag number updates:${err}`, { calledFrom: 'flag.js' });
    });
});

// GET: Fetch Flag Number details
ApiFlagRouter.route('/:id').get((req, res) => {
  const { id } = req.params;
  db.Flag.findOne({
    where: {
      FlagNumber: id,
      RallyYear: {
        [Op.in]: rallyYearArray,
      },
    },
  }).then((dbPost) => {
    res.json(dbPost);
  });
});

module.exports = ApiFlagRouter;
