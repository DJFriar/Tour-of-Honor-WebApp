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

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

AdminAuthRouter.route('/startSeason').post(async (req, res) => {
  const sqlQuery = `UPDATE Categories SET Active = 1 WHERE id = 1`;
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

AdminAuthRouter.route('/iba-awards').get(async (req, res) => {
  const sqlQuery = `
    SELECT DISTINCT	
      a.id, a.Name, a.RideDate, a.FlagNumber, 
      f.UserID, 
      u.FirstName, u.LastName 
    FROM Awards a 
      INNER JOIN Flags f ON a.FlagNumber = f.FlagNumber 
        AND f.RallyYear = ?	
      INNER JOIN Users u ON f.UserID = u.id 
    WHERE a.RallyYear = ? 
    ORDER BY a.id
  `;
  try {
    const ibaAwards = await sequelize.query(sqlQuery, {
      replacements: [currentRallyYear, currentRallyYear],
      type: QueryTypes.SELECT,
    });
    res.json(ibaAwards);
  } catch (err) {
    logger.error(`Error encountered getting OrderDetails: ${err}`, {
      calledFrom: 'api/v1/orders.js',
    });
  }
});

// Delete an Award
AdminAuthRouter.route('/award-iba/:id').delete(async (req, res) => {
  const { id } = req.params;
  db.Award.destroy({
    where: {
      id,
    },
  }).then(() => {
    res.status(202).send();
  });
});

module.exports = AdminAuthRouter;
