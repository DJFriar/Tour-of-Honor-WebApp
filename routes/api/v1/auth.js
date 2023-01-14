require('dotenv').config();

const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');

const q = require('../../../private/queries');
const hasValidApiKey = require('../../../middleware/authCheck');

router.post('/', hasValidApiKey, async (req, res) => {
  const { flag, zipcode } = req.body;
  // const User = await q.queryUserIDFromFlagNum(flag);
  const User = await q.queryRiderInfoByFlag(flag);
  const UserData = User[0];
  if (!UserData || UserData.ZipCode !== zipcode) {
    console.error(`UserData returned false: ${JSON.stringify(UserData)}`);
    return res.sendStatus(400);
  }

  const token = jwt.sign(
    {
      UserID: UserData.id,
      FirstName: UserData.FirstName,
      LastName: UserData.LastName,
      Email: UserData.Email,
      FlagNumber: UserData.FlagNumber,
      ZipCode: UserData.ZipCode,
      PassengerFlag: UserData.PillionFlagNumber,
    },
    process.env.JWT_SECRET,
  );
  return res.send(token);
});

module.exports = router;
