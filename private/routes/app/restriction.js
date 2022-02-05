const express = require("express");
const router = express.Router();
const db = require("../../../models");

// Fetch a specific Restriction
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.Restriction.findOne({
    where: {
      id: id
    }
  }).then(function (restriction) {
    res.json(restriction);
  });
})

module.exports = router;
