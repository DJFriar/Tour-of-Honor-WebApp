/**
 * routes/web/rules.js
 *
 * @description:: Route file for the Rules section of the Web (front-end) sub-application. All routes with "/rules" come through here.
 *
 */

const WebRulesRouter = require('express').Router();

const { logger } = require('../../controllers/logger');
const q = require('../../private/queries');

WebRulesRouter.route('/').get(async (req, res) => {
  let activeUser = false;
  let Rules;
  if (req.user) {
    activeUser = true;
  }

  try {
    Rules = await q.queryAllRules();
  } catch (err) {
    logger.error(`Error encountered: queryAllRules(). ${err}`, { calledFrom: 'rules.js' });
  }

  res.locals.title = 'TOH Rules';
  res.render('pages/rules', {
    activeUser,
    User: req.user,
    NotificationText: '',
    Rules,
  });
});

module.exports = WebRulesRouter;
