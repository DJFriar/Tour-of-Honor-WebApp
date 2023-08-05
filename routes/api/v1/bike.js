/**
 * routes/api/bike.js
 *
 * @description:: Handler file for API calls related to bikes. All routes with "/api/v1/bike" come through here.
 *
 */

const ApiBikeRouter = require('express').Router();

const db = require('../../../models');

ApiBikeRouter.route('/')
  .get((req, res) => {
    db.Bike.findAll({}).then((bikeArray) => {
      res.json(bikeArray);
    });
  })
  .post((req, res) => {
    db.BikeMake.findOne({ where: { id: req.body.BikeMake } }).then((bikeMake) => {
      db.Bike.create({
        user_id: req.body.UserID,
        Year: req.body.BikeYear,
        Make: bikeMake.Name,
        make_id: req.body.BikeMake,
        Model: req.body.BikeModel,
      }).then(() => {
        res.status(202).send();
      });
    });
  })
  .put((req, res) => {
    db.BikeMake.findOne({ where: { id: req.body.BikeMake } }).then((bikeMake) => {
      db.Bike.update(
        {
          Year: req.body.BikeYear,
          Make: bikeMake.Name,
          make_id: req.body.BikeMake,
          Model: req.body.BikeModel,
        },
        {
          where: { id: req.body.BikeID },
        },
      ).then(() => {
        res.status(202).send();
      });
    });
  });

ApiBikeRouter.route('/make')
  .get((req, res) => {
    db.BikeMake.findAll({}).then((bikeMakeArray) => {
      res.json(bikeMakeArray);
    });
  })
  .post((req, res) => {
    db.BikeMake.create({
      Name: req.body.BikeMakeName,
    }).then(() => {
      res.status(202).send();
    });
  });

ApiBikeRouter.route('/make/:id').delete((req, res) => {
  const { id } = req.params;
  db.BikeMake.destroy({
    where: { id },
  }).then(() => {
    res.status(202).send();
  });
});

ApiBikeRouter.route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    db.Bike.findOne({
      where: { id },
    }).then((bikeInfo) => {
      res.json(bikeInfo);
    });
  })
  .delete((req, res) => {
    const { id } = req.params;
    db.Bike.destroy({
      where: { id },
    }).then(() => {
      res.status(202).send();
    });
  });

module.exports = ApiBikeRouter;
