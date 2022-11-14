require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const q = require("../../queries");

router.post("/", async (req, res) => {
  const { flag, zipcode } = req.body;
  const User = await q.queryUserIDFromFlagNum(flag);
  const UserData = User[0];
  if (!UserData || UserData.ZipCode !== zipcode) {
    console.log("==== auth response ====");
    console.log(User.FlagNumber);
    return res.status(400).send({ error: "Invalid flag or zipcode." });
  }

  const token = jwt.sign(
    { UserID: UserData.id, 
      FirstName: UserData.FirstName, 
      LastName: UserData.LastName, 
      Email: UserData.Email, 
      FlagNumber: UserData.FlagNumber,
      ZipCode: UserData.ZipCode,
      PassengerFlag: UserData.PillionFlagNumber
    },
    process.env.JWT_SECRET
  );
  res.send(token);
});

module.exports = router;
