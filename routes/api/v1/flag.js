const ApiFlagRouter = require("express").Router();

const db = require("../../../models");
const { logger } = require("../../../controllers/logger");

ApiFlagRouter.route("/")
  .post((req, res) => {
    db.Flag.create({
      FlagNum: req.body.FlagNumber,
      UserID: req.body.UserID,
      RallyYear: req.body.RallyYear
    }).then(() => {
      logger.info("Flag number " + req.body.FlagNumber + " assigned to UserID " + req.body.UserID); 
      res.status(202).send();
    }).catch(err => {
      logger.error("Error when saving flag number assignments:" + err);
    })
  });

// Check Flag Number Validity
ApiFlagRouter.route("/:id")
  .get((req,res) => {
    const id = req.params.id;
    db.Flag.findOne({
      where: {
        FlagNum: id,
        RallyYear: 2022
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });

module.exports = ApiFlagRouter;