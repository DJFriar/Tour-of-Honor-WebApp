const WebRulesRouter = require("express").Router();

const { logger } = require('../../controllers/logger');
const q = require("../../private/queries");

WebRulesRouter.route("/")
  .get(async (req, res) => {
    var activeUser = false;
    if (req.user) { activeUser = true };

    try {
      var Rules = await q.queryAllRules();
    } catch {
      logger.error("Error encountered: queryAllRules");
    }

    res.locals.title = "TOH Rules"
    res.render("pages/rules", {
      activeUser,
      User: req.user,
      NotificationText: "",
      Rules
    });
  });

module.exports = WebRulesRouter;