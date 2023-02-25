/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const { dblogger } = require('../controllers/logger');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'Development';
const config = require(`${__dirname}/../config/db-config.js`)[env];
const db = {};

const sequelize = new Sequelize(config);

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    dblogger.info('DB connection has been established successfully.', {
      calledFrom: 'models/index.js',
    });
  })
  .catch(() => {
    dblogger.error('Unable to connect to the DB: ', { calledFrom: 'models/index.js' });
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
