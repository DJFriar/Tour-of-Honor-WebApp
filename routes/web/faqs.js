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
    logger.error('Error encountered - queryAllFAQs: ', err);
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
