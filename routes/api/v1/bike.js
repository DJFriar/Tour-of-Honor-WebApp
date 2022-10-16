const ApiBikeRouter = require("express").Router();

const db = require("../../../models");

ApiBikeRouter.route('/')
  .get(function (req, res) {
    db.Bike.findAll({}).then(function (bikeArray) {
      res.json(bikeArray);
    })
  })
  .post((req, res) => {
    db.Bike.create({
      user_id: req.body.UserID,
      Year: req.body.BikeYear,
      Make: req.body.BikeMake,
      Model: req.body.BikeModel,
    }).then(() => {
      res.status(202).send();
    })
  })
  .put((req, res) => {
    db.Bike.update({
      Year: req.body.BikeYear,
      Make: req.body.BikeMake,
      Model: req.body.BikeModel,
    }, {
      where: { id: req.body.BikeID }
    }).then(() => {
      res.status(202).send();
    })
  });

ApiBikeRouter.route('/:id')
  .get(function(req, res) {
    const id = req.params.id;
    db.Bike.findOne({
      where: { id: id }
    }).then(function(bikeInfo) {
      res.json(bikeInfo);
    })
  })
  .delete(function(req, res) {
    const id = req.params.id;
    db.Bike.destroy({
      where: { id: id }
    }).then(() => {
      res.status(202).send();
    });
  });

module.exports = ApiBikeRouter;