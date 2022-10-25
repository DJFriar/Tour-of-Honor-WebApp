/**
 * routes/api/index.js
 *
 * @description:: Index file for the API sub-application. All routes with "/api/v1/" comes through here.
 *
 */

const ApiRouter = require('express').Router();

ApiRouter.use('/bike', require('./v1/bike'));
ApiRouter.use('/flag', require('./v1/flag'));

module.exports = ApiRouter;
