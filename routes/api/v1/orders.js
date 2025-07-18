/**
 * routes/api/orders.js
 *
 * @description:: Handler file for API calls related to orders. All routes with "/api/v1/orders" come through here.
 *
 */

const ApiOrderRouter = require('express').Router();
const { QueryTypes } = require('sequelize');

const { logger } = require('../../../controllers/logger');
const db = require('../../../models');
const { sequelize } = require('../../../models');
const q = require('../../../private/queries');
const { checkOrderStatusByCheckoutID } = require('../../../controllers/shopify');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

// Get All Orders with Details
ApiOrderRouter.route('/').get(async (req, res) => {
  const sqlQuery = `
    SELECT o.id, 
      CASE 
        WHEN o.NextStepNum = 0 THEN 'Rider Info' 
        WHEN o.NextStepNum = 1 THEN 'Bike Info'
        WHEN o.NextStepNum = 2 THEN 'Passenger Info' 
        WHEN o.NextStepNum = 3 THEN 'Charity Choice' 
        WHEN o.NextStepNum = 4 THEN 'Waiver' 
        WHEN o.NextStepNum = 5 THEN 'Payment' 
        WHEN o.NextStepNum = 6 THEN 'Flag Number' 
        WHEN o.NextStepNum = 8 THEN 'Completed' 
      END AS NextStep,  
      o.RallyYear,  
      CASE WHEN ISNULL(o.OrderNumber) THEN 'UNPAID' ELSE o.OrderNumber END AS OrderNumber, 
      CONCAT(CASE WHEN o.ShirtSize = 'NA' THEN '' ELSE o.ShirtSize END, ' ',  o.ShirtStyle) AS RiderShirt, 
      CASE WHEN o.PassUserID = 0 THEN '' ELSE CONCAT(CASE WHEN o.PassShirtSize = 'NA' THEN '' ELSE o.PassShirtSize END, ' ', o.PassShirtStyle) END AS PassengerShirt, 
      u1.id AS RiderID, o.PassUserID, u1.FirstName AS RiderFirstName,  u1.LastName AS RiderLastName, u1.Email AS RiderEmail, u1.CellNumber,
      u1.Address1 AS Address, u1.City, u1.State, u1.ZipCode,
      CASE WHEN ISNULL(o.RequestedRiderFlagNumber) THEN '-' ELSE o.RequestedRiderFlagNumber END AS RiderFlagNumber, 
      CASE WHEN o.PassUserID = 0 THEN '' ELSE CONCAT(u2.FirstName, ' ', u2.LastName) END AS PassengerName, 
      CASE WHEN ISNULL(o.RequestedPassFlagNumber) THEN '' ELSE o.RequestedPassFlagNumber END AS PassFlagNumber, 
      pt.Price AS PriceCharged, 
      CASE WHEN o.CharityChosen = 0 THEN '-' ELSE c.Name END AS CharityName, 
      IF(ISNULL(f.id), 1, 0) AS isNew,
      o.applyFlagSurcharge,
      o.FlagSurchargeOrderNumber,
      o.updatedAt
    FROM Orders o 
      LEFT JOIN Users u1 ON o.UserID = u1.id 
      LEFT JOIN Users u2 ON o.PassUserID = u2.id 
      LEFT JOIN PriceTiers pt ON o.PriceTier = pt.id 
      LEFT JOIN Charities c ON o.CharityChosen = c.id 
      LEFT JOIN Flags f ON o.UserID = f.UserID AND f.RallyYear = ? 
    WHERE o.RallyYear = ?
    ORDER BY o.id DESC
  `;
  try {
    const OrderDetails = await sequelize.query(sqlQuery, {
      replacements: [currentRallyYear - 1, currentRallyYear],
      type: QueryTypes.SELECT,
    });
    res.json(OrderDetails);
  } catch (err) {
    logger.error(`Error encountered getting OrderDetails: ${err}`, {
      calledFrom: 'api/v1/orders.js',
    });
  }
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
      calledFrom: 'api/v1/orders.js',
    });
    throw err;
  }
});

// Set Order back to Flag Number step
ApiOrderRouter.route('/reset').post(async (req, res) => {
  const bodyJSON = JSON.stringify(req.body);
  logger.info(`Flag Reset was performed with the following info: ${bodyJSON}`, {
    calledFrom: 'api/v1/orders.js',
  });
  const OrderUpdateInfo = {
    NextStepNum: 6,
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
      calledFrom: 'api/v1/orders.js',
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

// Check Flag Surcharge status on an Order
ApiOrderRouter.route('/checkFlagOrderStatus/:oid').get(async (req, res) => {
  const { oid } = req.params;
  db.Order.findOne({
    where: {
      id: oid,
      RallyYear: currentRallyYear,
    },
  }).then(async (o) => {
    if (o.FlagSurchargeOrderNumber === null) {
      logger.info(`FlagSurchargeOrderNumber not found locally, checking Shopify...`, {
        calledFrom: 'api/v1/orders.js',
      });
      // Check Shopify for an Order Number
      let flagOrderNumber;
      try {
        flagOrderNumber = await checkOrderStatusByCheckoutID(o.FlagSurchargeCheckoutID);
      } catch (err) {
        logger.warn(
          `flagOrderNumber not found for TOH Order ${oid}. Flag order is likely not paid for yet.${err}`,
        );
        res.json(0);
      }
      // If Shopify provides us with an Order number, then add it to the DB.
      if (flagOrderNumber) {
        db.Order.update(
          {
            FlagSurchargeOrderNumber: flagOrderNumber,
          },
          {
            where: {
              id: oid,
              RallyYear: currentRallyYear,
            },
          },
        ).then(() => {
          logger.info(`Shopify Flag Order Number updated for order ${oid}`, {
            calledFrom: 'api/v1/orders.js',
          });
          res.json(flagOrderNumber);
        });
      }
    }
    if (o.FlagSurchargeOrderNumber) {
      logger.info(`Shopify Flag Order Number found locally: ${o.FlagSurchargeOrderNumber}`, {
        calledFrom: 'api/v1/orders.js',
      });
      res.json(o.FlagSurchargeOrderNumber);
    }
  });
});

// Check Order payment status by User ID
ApiOrderRouter.route('/checkOrderStatus/:id').get(async (req, res) => {
  const { id } = req.params;
  db.Order.findOne({
    where: {
      UserID: id,
      RallyYear: currentRallyYear,
    },
  }).then(async (o) => {
    if (o.OrderNumber === null) {
      logger.info(`OrderNumber not found locally, checking Shopify...`, {
        calledFrom: 'api/v1/orders.js',
      });
      // Check Shopify for an Order Number
      let orderNumber;
      try {
        orderNumber = await checkOrderStatusByCheckoutID(o.CheckoutID);
      } catch (err) {
        logger.warn(
          `orderNumber not found for TOH Order ${o.id}. Order is likely not paid for yet.${err}`,
        );
        res.json(0);
      }
      // If Shopify provides us with an Order number, then add it to the DB.
      if (orderNumber) {
        db.Order.update(
          {
            OrderNumber: orderNumber,
            NextStepNum: 6,
          },
          {
            where: {
              RallyYear: currentRallyYear,
              UserID: id,
            },
          },
        ).then(() => {
          logger.info(`Shopify Order Number updated for rider ${id}`, {
            calledFrom: 'api/v1/orders.js',
          });
          res.json(orderNumber);
        });
      }
    }
    if (o.OrderNumber) {
      logger.info(`Shopify Order Number found locally: ${o.OrderNumber}`, {
        calledFrom: 'api/v1/orders.js',
      });
      res.json(o.OrderNumber);
    }
  });
});

// Update Order Paid status from Shopify
ApiOrderRouter.route('/orderPaid').post(async (req, res) => {
  logger.info(`Shopify Webhook Payload: ${JSON.stringify(req.body)}`, {
    calledFrom: 'api/v1/orders.js',
  });
  const OrderNumber = req.body.order_number;
  const tohOrderTag = req.body.note_attributes[0].value || '';
  const UserID = tohOrderTag.split('_')[0] || 0;
  // const RallyYear = tohOrderTag.split('_')[1];
  if (UserID > 0) {
    db.Order.update(
      {
        OrderNumber,
        NextStepNum: 6,
      },
      {
        where: {
          RallyYear: currentRallyYear,
          UserID,
        },
      },
    ).then(() => {
      logger.info(`Shopify Order Number updated for rider ${UserID}`, {
        calledFrom: 'api/v1/orders.js',
      });
      res.status(202).send();
    });
  } else {
    logger.warn(`Shopify Webhook was missing tohOrderTag`, {
      calledFrom: 'api/v1/orders.js',
    });
    res.status(400).send('Invalid User ID');
  }
});

module.exports = ApiOrderRouter;
