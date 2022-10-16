const WebFaqRouter = require("express").Router();

const { logger } = require('../../controllers/logger');
const q = require("../../private/queries");

WebFaqRouter.route("/")
  .get(async (req, res) => {
    var activeUser = false;
    if (req.user) { activeUser = true };

    try {
      var Faqs = await q.queryAllFAQs();
    } catch {
      logger.error("Error encountered: queryAllFAQs");
    }

    res.locals.title = "TOH FAQs"
    res.render("pages/faqs", {
      activeUser,
      User: req.user,
      NotificationText: "",
      Faqs
    });
  });

module.exports = WebFaqRouter;