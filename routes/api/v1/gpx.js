const ApiGPXRouter = require('express').Router();
const { createGPXFile } = require('../../../controllers/gpx');

const { logger } = require('../../../controllers/logger');
// const db = require('../../../models');
const q = require('../../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

ApiGPXRouter.route('/').get(async (req, res) => {
  createGPXFile();
});

module.exports = ApiGPXRouter;
