/**
 * routes/api/memorial.js
 *
 * @description:: Handler file for API calls related to a single memorial. All routes with "/api/v1/memorial" come through here.
 *
 */

const ApiMemorialRouter = require('express').Router();
const { QueryTypes } = require('sequelize');

const db = require('../../../models');
const hasValidApiKey = require('../../../middleware/authCheck');
const { logger } = require('../../../controllers/logger');

const { sequelize } = db;

ApiMemorialRouter.use(hasValidApiKey);

// Fetch combined data for a specific Memorial by Code
ApiMemorialRouter.route('/data/c/:code').get(async (req, res) => {
  const { code } = req.params;
  let MemorialDataByCode;
  const sqlQuery = `
    SELECT 
      c.Name AS CategoryName, 
      r.Name AS RestrictionName, 
      m.* 
    FROM Memorials m 
      INNER JOIN Categories c ON m.Category = c.id 
      INNER JOIN Restrictions r ON m.Restrictions = r.id 
    WHERE m.Code = ? 
    LIMIT 1
  `;
  try {
    MemorialDataByCode = await sequelize.query(sqlQuery, {
      replacements: [code],
      type: QueryTypes.SELECT,
    });
  } catch (err) {
    logger.error(`Error encountered getting MemorialDataByCode: ${err}`, {
      calledFrom: 'api/v1/memorial.js',
    });
  }
  res.json(MemorialDataByCode);
});

// Fetch combined data for a specific Memorial by ID
ApiMemorialRouter.route('/data/:id').get(async (req, res) => {
  const { id } = req.params;
  let MemorialDataByID;
  const sqlQuery = `
    SELECT 
      c.Name AS CategoryName, 
      r.Name AS RestrictionName, 
      m.* 
    FROM Memorials m 
      INNER JOIN Categories c ON m.Category = c.id 
      INNER JOIN Restrictions r ON m.Restrictions = r.id 
    WHERE m.id = ? 
    LIMIT 1
  `;
  try {
    MemorialDataByID = await sequelize.query(sqlQuery, {
      replacements: [id],
      type: QueryTypes.SELECT,
    });
  } catch (err) {
    logger.error(`Error encountered getting MemorialDataByID: ${err}`, {
      calledFrom: 'api/v1/memorial.js',
    });
  }
  res.json(MemorialDataByID);
});

// Fetch a Memorial Text Entry
ApiMemorialRouter.route('/text/:id').get((req, res) => {
  const { id } = req.params;
  db.MemorialMeta.findAll({
    where: {
      MemorialID: id,
    },
    order: [['Heading', 'ASC']],
  }).then((dbPost) => {
    res.json(dbPost);
  });
});

// Fetch status of memorial for a given user
ApiMemorialRouter.route('/status/:memid/:userid').get(async (req, res) => {
  const memId = req.params.memid;
  const userId = req.params.userid;
  let MemorialStatus;
  const sqlQuery = `
    SELECT Status 
    FROM Submissions 
    WHERE MemorialID = ? AND UserID = ? 
    ORDER BY updatedAt DESC 
    LIMIT 1
  `;
  try {
    MemorialStatus = await sequelize.query(sqlQuery, {
      replacements: [memId, userId],
      type: QueryTypes.SELECT,
    });
  } catch (err) {
    logger.error(`Error encountered getting MemorialStatus: ${err}`, {
      calledFrom: 'api/v1/memorial.js',
    });
  }
  if (MemorialStatus.length === 0) {
    MemorialStatus = [
      {
        Status: 9,
      },
    ];
  }
  res.json(MemorialStatus);
});

module.exports = ApiMemorialRouter;
