const ApiOrderRouter = require('express').Router();

const { logger } = require('../../../controllers/logger');
// const db = require('../../../models');
const q = require('../../../private/queries');

ApiOrderRouter.route('/').get(async (req, res) => {
  let OrderDetails;
  try {
    OrderDetails = await q.queryAllOrdersWithDetail();
  } catch (err) {
    logger.error(`Error encountered: queryAllOrdersWithDetail.${err}`);
  }
  res.json(OrderDetails);
});

module.exports = ApiOrderRouter;
