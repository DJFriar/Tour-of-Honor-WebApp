/**
 * routes/index.js
 */

const MainRouter = require('express').Router();

MainRouter.use('/api/v1', require('./api'));
MainRouter.use('/', require('./web'));

module.exports = MainRouter;
