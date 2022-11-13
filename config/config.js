require("dotenv").config();

module.exports = {
  Development: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: "mysql"
  },
  Testing: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: "mysql"
  },
  Production: {
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: "mysql"
  }
};