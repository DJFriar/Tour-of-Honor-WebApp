const express = require("express");
const router = express.Router();
const db = require("../../../models");
const q = require("../../queries");

// Fetch combined data for a specific Memorial
router.get("/data/:id", async (req, res) => {
  const id = req.params.id
  try {
    var MemorialData = await q.queryMemorialData(id);
  } catch {
    console.log("Error encountered: queryMemorialData");
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

module.exports = router;