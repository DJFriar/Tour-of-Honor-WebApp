/**
 * routes/api/memorials.js
 *
 * @description:: Handler file for API calls related to memorials. All routes with "/api/v1/memorials" come through here.
 *
 */

const ApiMemorialsRouter = require('express').Router();
const { QueryTypes } = require('sequelize');

const db = require('../../../models');
const hasValidApiKey = require('../../../middleware/authCheck');
const { logger } = require('../../../controllers/logger');

const { sequelize } = db;

// ApiMemorialsRouter.use(hasValidApiKey);

ApiMemorialsRouter.route('/').get(async (req, res) => {
  let Memorials;
  const sqlQuery = `
    SELECT 
      m.*, 
      c.Name AS CategoryName, 
      r.Name AS RestrictionName 
    FROM Memorials m 
      INNER JOIN Categories c ON m.Category = c.id 
      LEFT JOIN Restrictions r ON m.Restrictions = r.id 
    WHERE m.RallyYear = 2023
      AND c.Active = 1 
      AND m.Restrictions != 12 
    ORDER BY m.State, m.City, m.Category
  `;
  try {
    Memorials = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });
  } catch (err) {
    logger.error(`Error encountered getting Memorials: ${err}`, {
      calledFrom: 'api/v1/memorials.js',
    });
  }
  res.json(Memorials);
});

// Fetch Memorial list with User Status included
ApiMemorialsRouter.route('/status/:id').get(async (req, res) => {
  const { id } = req.params;
  let MemorialList;
  const sqlQuery = `
    SELECT 
      s.Status AS 'RiderStatus', 
      m.*, 
      c.Name AS CategoryName, 
      r.Name AS RestrictionName 
    FROM Memorials m 
      INNER JOIN Categories c ON m.Category = c.id 
      LEFT JOIN Restrictions r ON m.Restrictions = r.id 
      LEFT JOIN Submissions s ON m.id = s.MemorialID AND s.UserID = ? AND s.createdAt > '2023-01-01'
    WHERE c.Active = 1 
      AND m.Restrictions != 12 
    ORDER BY m.State, m.City, m.Category
  `;
  try {
    MemorialList = await sequelize.query(sqlQuery, {
      replacements: [id],
      type: QueryTypes.SELECT,
    });
  } catch (err) {
    logger.error(`Error encountered getting MemorialList: ${err}`, {
      calledFrom: 'api/v1/memorials.js',
    });
  }
  res.json(MemorialList);
});

module.exports = ApiMemorialsRouter;
