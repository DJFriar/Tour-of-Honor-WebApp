/**
 * routes/api/charity.js
 *
 * @description:: Handler file for API calls related to waivers. All routes with "/api/v1/waiver" come through here.
 *
 */

const ApiWaiverRouter = require('express').Router();

const { logger } = require('../../../controllers/logger');
const db = require('../../../models');
// const q = require('../../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

ApiWaiverRouter.route('/').post((req, res) => {
  const waiverID = req.body.unique_id;
  const smartWaiverURL = `https://api.smartwaiver.com/v4/waivers/${waiverID}`;
  const smartWaiverAPIKey = process.env.SMARTWAIVER_API_KEY;

  let RiderID = 0;

  logger.info(`Waiver Webhook Response: ${req.body}`, { calledFrom: 'be-routes.js' });

  fetch(smartWaiverURL, {
    method: 'get',
    headers: { 'sw-api-key': smartWaiverAPIKey },
  })
    .then((res2) => res2.json())
    .then((json) => {
      try {
        RiderID = json.waiver.autoTag || 0;
        updateWaiverTable(RiderID);
      } catch (err) {
        logger.error(
          `No user found when fetching from SmartWaiver. Response was: ${json} | ${err}`,
          {
            calledFrom: 'be-routes.js',
          },
        );
      }
    });

  async function updateWaiverTable(rider) {
    if (rider > 0) {
      await db.Waiver.findOrCreate({
        where: {
          UserID: rider,
          RallyYear: currentRallyYear,
        },
        defaults: {
          UserID: rider,
          WaiverID: waiverID,
          RallyYear: currentRallyYear,
        },
      });
      res.status(200).send();
    } else {
      logger.error(`UserID ${rider} was not found in SmartWaiver response.`, {
        calledFrom: 'be-routes.js',
      });
    }
  }

  res.status(404).send();
});

// Check Waiver Status
ApiWaiverRouter.route('/:id').get((req, res) => {
  const waiverID = req.params.id;
  db.Waiver.findOne({
    where: {
      UserID: waiverID,
      RallyYear: currentRallyYear,
    },
  }).then((waiverData) => {
    res.json(waiverData);
  });
});

module.exports = ApiWaiverRouter;
