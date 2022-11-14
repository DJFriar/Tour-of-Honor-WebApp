const { dblogger } = require('../controllers/logger');
require('dotenv').config();

module.exports = {
  Development: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: 'mysql',
    logging: (msg) => dblogger.info(msg),
  },
  Testing: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: 'mysql',
    logging: (msg) => dblogger.info(msg),
  },
  Production: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: 'mysql',
    logging: (msg) => dblogger.info(msg),
  },
};
