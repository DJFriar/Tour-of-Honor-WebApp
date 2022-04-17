const express = require("express");
const router = express.Router();
const db = require("../../../models");

router.get("/", async (req, res) => {
  try {
    var MemorialData = await q.queryAllAvailableMemorials();
  } catch(err) {
    console.log("Error encountered: queryAllAvailableMemorials");
    console.log(err);
  }
  res.json(MemorialData);
})

module.exports = router;