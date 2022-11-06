const _ = require('lodash');
const ApiFlagRouter = require('express').Router();
const { DateTime } = require('luxon');
const { Op } = require('sequelize');

const db = require('../../../models');
const { logger } = require('../../../controllers/logger');

ApiFlagRouter.route('/').post((req, res) => {
  logger.debug('FlagPostAPI entered');
  db.Flag.create({
    FlagNum: req.body.FlagNumber,
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

// Check Flag Number Validity
ApiFlagRouter.route('/:id').get((req, res) => {
  const { id } = req.params;
  db.Flag.findOne({
    where: {
      FlagNum: id,
      RallyYear: 2022,
    },
  }).then((dbPost) => {
    res.json(dbPost);
  });
});

// Find Next Available Flag Number
ApiFlagRouter.route('/nextAvailable').get((req, res) => {
  const rallyYearArray = [process.env.ORDERING_RALLY_YEAR];
  if (DateTime.now().toISO() < process.env.RELEASE_UNRESERVED_FLAGS_DATE) {
    rallyYearArray.unshift(process.env.CURRENT_RALLY_YEAR);
  }
  db.Flag.findAll({
    where: {
      RallyYear: {
        [Op.in]: rallyYearArray,
      },
    },
    order: [['FlagNum', 'ASC']],
    raw: true,
  }).then((flags) => {
    const allowedNumbers = _.range(11, 1201, 1);
    const badNumbers = flags.map((inUse) => inUse.FlagNum);
    const goodNumbers = _.pullAll(allowedNumbers, badNumbers);
    const nextFlag = _.min(goodNumbers);
    res.json(nextFlag);
  });
});

module.exports = ApiFlagRouter;
