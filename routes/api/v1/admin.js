/**
 * routes/api/admin.js
 *
 * @description:: Handler file for API calls related to admin. All routes with "/api/v1/admin" come through here.
 *
 */

const AdminAuthRouter = require('express').Router();
const { QueryTypes } = require('sequelize');

const db = require('../../../models');
const { logger } = require('../../../controllers/logger');

const { sequelize } = db;

AdminAuthRouter.route('/startSeason').post(async (req, res) => {
  const sqlQuery = `UPDATE Categories SET Active = 1 WHERE id = 1`;

  try {

  } catch {

  }
  await sequelize
    .query(sqlQuery, {
      type: QueryTypes.UPDATE,
    })
    .then(() => {
      logger.info(`State Memorials have been made visible.`, {
        calledFrom: 'api/v1/admin.js',
      });
      res.status(202).send();
    })
    .catch((err) => {
      logger.error(`Failed to enable season: ${err}`, {
        calledFrom: 'api/v1/admin.js',
      });
      res.status(400).send();
    });
});

module.exports = AdminAuthRouter;
