/**
 * routes/web/faqs.js
 *
 * @description:: Route file for the FAQ section of the Web (front-end) sub-application. All routes with "/faqs" come through here.
 *
 */

const WebFaqRouter = require('express').Router();

const { logger } = require('../../controllers/logger');
const q = require('../../private/queries');

WebFaqRouter.route('/').get(async (req, res) => {
  let activeUser = false;
  let Faqs;
  if (req.user) {
    activeUser = true;
  }

  try {
    Faqs = await q.queryAllFAQs();
  } catch (err) {
    logger.error(`Error encountered: queryAllFAQs().${err}`, { calledFrom: 'faqs.js' });
  }

  res.locals.title = 'TOH FAQs';
  res.render('pages/faqs', {
    activeUser,
    User: req.user,
    NotificationText: '',
    Faqs,
  });
});

module.exports = WebFaqRouter;
