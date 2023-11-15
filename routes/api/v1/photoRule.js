/**
 * routes/api/photoRule.js
 *
 * @description:: Handler file for API calls related to photo rules. All routes with "/api/v1/photoRule" come through here.
 *
 */

const ApiPhotoRuleRouter = require('express').Router();

const db = require('../../../models');
const { logger } = require('../../../controllers/logger');

// const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

ApiPhotoRuleRouter.route('/')
  .get(async (req, res) => {
    db.PhotoRule.findAll({
      order: [['RuleName', 'ASC']],
    }).then((photoRules) => {
      res.json(photoRules);
    });
  })
  .post((req, res) => {
    logger.debug('PhotoRuleAPI entered');
    db.PhotoRule.create({
      RuleName: req.body.RuleName,
      RuleText: req.body.RuleText,
    })
      .then(() => {
        res.status(202).send();
      })
      .catch((err) => {
        logger.error(`Error when saving photo rule: ${err}`, {
          calledFrom: 'api/v1/photoRule.js',
        });
      });
  })
  .delete((req, res) => {
    db.PhotoRule.destroy({
      where: {
        id: req.body.id,
      },
    }).then(() => {
      res.status(202).send();
    });
  });

module.exports = ApiPhotoRuleRouter;
