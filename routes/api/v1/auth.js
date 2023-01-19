require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const q = require('../../../private/queries');
const { logger } = require('../../../controllers/logger');
const hasValidApiKey = require('../../../middleware/authCheck');

const router = express.Router();

router.post('/', hasValidApiKey, async (req, res) => {
  const { flag, zipcode } = req.body;
  const User = await q.queryRiderInfoByFlag(flag);
  const UserData = User[0];
  if (!UserData || UserData.ZipCode !== zipcode) {
    logger.error(`UserData returned false: ${JSON.stringify(UserData)}`, {
      calledFrom: 'api/v1/auth.js',
    });
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
  console.log(`UserData: ${JSON.stringify(UserData)}`);
  return res.send(token);
});

module.exports = router;
