/**
 * routes/api/charity.js
 *
 * @description:: Handler file for API calls related to charities. All routes with "/api/v1/charity" come through here.
 *
 */

const ApiCharityRouter = require('express').Router();

const { logger } = require('../../../controllers/logger');
const db = require('../../../models');
const q = require('../../../private/queries');

ApiCharityRouter.route('/')
  .get(async (req, res) => {
    let CharityArray;
    try {
      CharityArray = await q.queryAllCharities();
    } catch (err) {
      logger.error(`Error encountered: queryAllCharities.${err}`, {
        calledFrom: 'api/v1/charity.js',
      });
    }
    res.json(CharityArray);
  })
  .post((req, res) => {
    db.Charity.create({
      RallyYear: req.body.RallyYear,
      Name: req.body.CharityName,
      URL: req.body.CharityURL,
    })
      .then((c) => {
        logger.info(`Charity ${c.id} created.`, { calledFrom: 'api/v1/charity.js' });
        res.status(200).send();
      })
      .catch((err) => {
        logger.error(`Error creating charity: ${err}`, { calledFrom: 'api/v1/charity.js' });
        res.status(401).json(err);
      });
  })
  .put((req, res) => {
    db.Charity.update(
      {
        Year: req.body.BikeYear,
        Make: req.body.BikeMake,
        Model: req.body.BikeModel,
      },
      {
        where: { id: req.body.BikeID },
      },
    ).then(() => {
      res.status(202).send();
    });
  });

ApiCharityRouter.route('/active').get(async (req, res) => {
  let CharityArray;
  try {
    CharityArray = await q.queryAllActiveCharities();
  } catch (err) {
    logger.error(`Error encountered: queryAllActiveCharities.${err}`, {
      calledFrom: 'api/v1/charity.js',
    });
  }
  res.json(CharityArray);
});

ApiCharityRouter.route('/donationCount').get(async (req, res) => {
  let DonationStats;
  try {
    DonationStats = await q.queryTotalDonationsByCharity();
  } catch (err) {
    logger.error(`Error encountered: queryTotalDonationsByCharity.${err}`, {
      calledFrom: 'api/v1/charity.js',
    });
  }
  res.json(DonationStats);
});

ApiCharityRouter.route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    db.Charity.findOne({
      where: { id },
    }).then((charityInfo) => {
      res.json(charityInfo);
    });
  })
  .delete((req, res) => {
    const { id } = req.params;
    db.Charity.destroy({
      where: { id },
    }).then(() => {
      res.status(200).send();
    });
  });

module.exports = ApiCharityRouter;
