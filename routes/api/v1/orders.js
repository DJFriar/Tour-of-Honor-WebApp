const ApiOrderRouter = require('express').Router();

const { logger } = require('../../../controllers/logger');
const db = require('../../../models');
const q = require('../../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

ApiOrderRouter.route('/').get(async (req, res) => {
  let OrderDetails;
  try {
    OrderDetails = await q.queryAllOrdersWithDetail();
  } catch (err) {
    logger.error(`Error encountered: queryAllOrdersWithDetail.${err}`);
  }
  res.json(OrderDetails);
});

ApiOrderRouter.route('/reset').post(async (req, res) => {
  const bodyJSON = JSON.stringify(req.body);
  logger.info(`Flag Reset was performed with the following info: ${bodyJSON}`, {
    calledBy: 'orders.js',
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

module.exports = ApiOrderRouter;
