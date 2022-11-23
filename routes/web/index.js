/**
 * routes/web/index.js
 *
 * @description:: Index file for the Web (front-end) sub-application. All routes with "/web" come through here.
 *
 */

const WebRouter = require('express').Router();

// WebRouter.use('/admin', require('./admin'));
WebRouter.use('/faqs', require('./faqs'));
WebRouter.use('/riders', require('./riders'));
WebRouter.use('/rules', require('./rules'));

module.exports = WebRouter;
