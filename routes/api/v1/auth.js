/**
 * routes/api/auth.js
 *
 * @description:: Handler file for API calls related to auth. All routes with "/api/v1/auth" come through here.
 *
 */

require('dotenv').config();

const ApiAuthRouter = require('express').Router();
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');

const db = require('../../../models');

const { sequelize } = db;
const { logger } = require('../../../controllers/logger');
const hasValidApiKey = require('../../../middleware/authCheck');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

ApiAuthRouter.use(hasValidApiKey);

ApiAuthRouter.route('/').post(async (req, res) => {
  const { flag, zipcode } = req.body;
  let storedZipCode = '00000';
  const sqlQuery = `
    SELECT 
      f.id, 
      f.FlagNumber, 
      f.UserID, 
      u.FirstName, 
      u.LastName, 
      CONCAT(u.FirstName, ' ', u.LastName) AS FullName, 
      u.Email, 
      u.ZipCode, 
      u.TimeZone 
    FROM Flags f 
      LEFT JOIN Users u ON u.id = f.UserID 
    WHERE f.FlagNumber = ? 
      AND f.RallyYear = ?
  `;
  const User = await sequelize.query(sqlQuery, {
    replacements: [flag, currentRallyYear],
    type: QueryTypes.SELECT,
  });
  const UserData = User[0];
  if (!UserData || UserData === undefined) {
    logger.error(`No rider found with Flag ${flag}.`, {
      calledFrom: 'api/v1/auth.js',
    });
    return res.sendStatus(400);
  }
  if (UserData) storedZipCode = UserData.ZipCode.slice(0, 5);
  if (storedZipCode !== zipcode) {
    logger.error(
      `The provided zip code (${zipcode}) doesn't match the zip code on record for Flag ${flag}`,
      {
        calledFrom: 'api/v1/auth.js',
      },
    );
    return res.sendStatus(400);
  }

  const token = jwt.sign(
    {
      UserID: UserData.UserID,
      FirstName: UserData.FirstName,
      LastName: UserData.LastName,
      Email: UserData.Email,
      FlagNumber: UserData.FlagNumber,
      ZipCode: UserData.ZipCode,
      PassengerFlag: UserData.PillionFlagNumber,
      TimeZone: UserData.TimeZone,
    },
    process.env.JWT_SECRET,
  );
  if (!process.env.ID_PROD) {
    // eslint-disable-next-line no-console
    console.log(`UserData: ${JSON.stringify(UserData)}`);
  }
  return res.send(token);
});

module.exports = ApiAuthRouter;
