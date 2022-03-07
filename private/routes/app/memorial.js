const express = require("express");
const router = express.Router();
const db = require("../../../models");
const q = require("../../queries");

// Fetch combined data for a specific Memorial
router.get("/data/:id", async (req, res) => {
  const id = req.params.id
  try {
    var MemorialData = await q.queryMemorialData(id);
  } catch(err) {
    console.log("Error encountered: queryMemorialData");
    console.log(err);
  }
  res.json(MemorialData);
})

// Fetch a Memorial Text Entry
router.get("/text/:id", (req, res) => {
  const id = req.params.id;
  db.MemorialMeta.findAll({
    where: {
      MemorialID: id
    },
    order: [[ "Heading", "ASC" ]]
  }).then(function (dbPost) {
    res.json(dbPost);
  });
})

// Fetch status of memorial for a given user
router.get("/status/:memid/:userid", async (req, res) => {
  const memId = req.params.memid;
  const userId = req.params.userid;
  try {
    var MemorialStatus = await q.queryMemorialStatusByUser(memId, userId);
    console.log("==== Memorial Status ====");
    console.log("Memorial " + memId + " & User " + userId);
  } catch(err) {
    console.log("Error encountered: queryMemorialStatusByUser");
    console.log(err);
  }
  if (MemorialStatus.length === 0) { 
    MemorialStatus = [{
      Status: 9
    }]
  };
  console.log(MemorialStatus);
  res.json(MemorialStatus);
})

module.exports = router;