/**
 * routes/api/index.js
 *
 * @description:: Index file for the API sub-application. All routes with "/api/v1/" come through here.
 *
 */

const ApiRouter = require('express').Router();

ApiRouter.use('/admin', require('./v1/admin'));
ApiRouter.use('/auth', require('./v1/auth'));
ApiRouter.use('/bike', require('./v1/bike'));
ApiRouter.use('/charity', require('./v1/charity'));
ApiRouter.use('/email', require('./v1/email'));
ApiRouter.use('/flag', require('./v1/flag'));
ApiRouter.use('/gpx', require('./v1/gpx'));
ApiRouter.use('/memorial', require('./v1/memorial'));
ApiRouter.use('/memorials', require('./v1/memorials'));
ApiRouter.use('/orders', require('./v1/orders'));
ApiRouter.use('/photoRule', require('./v1/photoRule'));
ApiRouter.use('/regFlow', require('./v1/regFlow'));
ApiRouter.use('/riders', require('./v1/riders'));
ApiRouter.use('/submission', require('./v1/submission'));
ApiRouter.use('/waiver', require('./v1/waiver'));

module.exports = ApiRouter;
