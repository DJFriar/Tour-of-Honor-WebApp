const express = require("express");
const router = express.Router();
const db = require("../../../models");

router.get("/", (req, res) => {
  db.Memorial.findAll({ }).then(function (memorials) {
    res.json(memorials);
  });
})

module.exports = router;