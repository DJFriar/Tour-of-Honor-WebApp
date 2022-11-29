const ApiOrderRouter = require('express').Router();
const { QueryTypes } = require('sequelize');

const { logger } = require('../../../controllers/logger');
const db = require('../../../models');
const { sequelize } = require('../../../models');
const q = require('../../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

// Get All Orders with Details
ApiOrderRouter.route('/').get(async (req, res) => {
  let OrderDetails;
  try {
    OrderDetails = await q.queryAllOrdersWithDetail();
  } catch (err) {
    logger.error(`Error encountered: queryAllOrdersWithDetail.${err}`, {
      calledBy: 'api/v1/orders.js',
    });
  }
  res.json(OrderDetails);
});

// Get Order Info by User ID
ApiOrderRouter.route('/user/:uid').get(async (req, res) => {
  const { uid } = req.params;
  const sqlQuery = `
    SELECT o.*, u1.FirstName AS RiderFirstName, u1.LastName AS RiderLastName, 
      CASE WHEN o.PassUserID = 0 THEN 'N/A' ELSE CONCAT(u2.FirstName, ' ', u2.LastName) END AS PassengerName, 
      CASE WHEN o.CharityChosen = 0 THEN 'Default' ELSE c.Name END AS CharityName 
    FROM Orders o 
      LEFT JOIN Users u1 ON o.UserID = u1.id 
      LEFT JOIN Users u2 ON o.PassUserID = u2.id 
      LEFT JOIN PriceTiers pt ON o.PriceTier = pt.id 
      LEFT JOIN Charities c ON o.CharityChosen = c.id 
    WHERE o.UserID = ? AND o.RallyYear = ?
  `;
  try {
    const orderInfoByRider = await sequelize.query(sqlQuery, {
      replacements: [uid, currentRallyYear],
      type: QueryTypes.SELECT,
    });
    res.json(orderInfoByRider);
  } catch (err) {
    logger.error(`An error was encountered in orderInfoByRider with uid: ${uid}`, {
      calledBy: 'api/v1/orders.js',
    });
    throw err;
  }
});

// Set Order back to Flag Number step
ApiOrderRouter.route('/reset').post(async (req, res) => {
  const bodyJSON = JSON.stringify(req.body);
  logger.info(`Flag Reset was performed with the following info: ${bodyJSON}`, {
    calledBy: 'api/v1/orders.js',
  });
  const OrderUpdateInfo = {
    NextStepNum: 7,
  };
  if (req.body.Role === 'Pass') {
    OrderUpdateInfo.RequestedPassFlagNumber = null;
  } else {
    OrderUpdateInfo.RequestedRiderFlagNumber = null;
  }
  db.Order.update(OrderUpdateInfo, {
    where: {
      id: req.body.OrderID,
    },
  });
  db.Flag.destroy({
    where: {
      FlagNumber: req.body.FlagNumber,
      RallyYear: currentRallyYear,
    },
  });
  res.status(202).send();
});

// Update the Flag Number on an Order
ApiOrderRouter.route('/updateFlag').put(async (req, res) => {
  const uid = req.body.RiderID;
  let oid;
  let riderInfo;
  try {
    riderInfo = await q.queryUserInfoByID(uid);
    oid = riderInfo[0].OrderID;
  } catch (err) {
    logger.error(`Error encountered: queryUserInfoByID(${uid}).${err}`, {
      calledBy: 'api/v1/orders.js',
    });
  }
  const OrderUpdateInfo = {};
  if (riderInfo[0].OrderRole === 'Pass') {
    OrderUpdateInfo.RequestedPassFlagNumber = req.body.NewFlagNumber;
  }
  if (riderInfo[0].OrderRole === 'Rider') {
    OrderUpdateInfo.RequestedRiderFlagNumber = req.body.NewFlagNumber;
  }
  db.Order.update(OrderUpdateInfo, {
    where: {
      id: oid,
    },
  });
  res.status(202).send();
});

module.exports = ApiOrderRouter;
