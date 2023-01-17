const ApiMemorialRouter = require('express').Router();

const { logger } = require('../../../controllers/logger');
// const db = require('../../../models');
const q = require('../../../private/queries');

ApiMemorialRouter.route('/').get(async (req, res) => {
  let Memorials;
  try {
    Memorials = await q.queryAllAvailableMemorials();
  } catch (err) {
    logger.error(`Error encountered: queryAllAvailableMemorials. ${err}`);
  }
  res.json(Memorials);
});

// Fetch Memorial list with User Status included
ApiMemorialRouter.route('/status/:id').get(async (req, res) => {
  const { id } = req.params;
  let MemorialList;
  try {
    MemorialList = await q.queryAllMemorialsWithUserStatus(id);
  } catch (err) {
    logger.error(`Error encountered: queryAllMemorialsWithUserStatus. ${err}`);
  }
  res.json(MemorialList);
});

module.exports = ApiMemorialRouter;
