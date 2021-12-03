const db = require("../../models");

module.exports = function (app) { 
  // Fetch all Memorials
  app.get("/api/v1/memorials/", (req, res) => {
    db.Memorial.findAll({ }).then(function (memorials) {
      res.json(memorials);
    });
  })

  // Fetch all Users
  app.get("/api/v1/users/", (req, res) => {
    db.User.findAll({ }).then(function (users) {
      res.json(users);
    });
  })
}