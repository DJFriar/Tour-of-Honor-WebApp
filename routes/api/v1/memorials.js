const ApiMemorialRouter = require('express').Router();

const { logger } = require('../../../controllers/logger');
// const db = require('../../../models');
const q = require('../../../private/queries');

ApiMemorialRouter.route('/').get(async (req, res) => {
  let Memorials;
  try {
    Memorials = await q.queryAllAvailableMemorials();
  } catch (err) {
    logger.error(`Error encountered: queryAllAvailableMemorials.${err}`);
  }
  res.json(Memorials);
});

module.exports = ApiMemorialRouter;
