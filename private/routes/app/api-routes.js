const db = require("../../../models");
const q = require("../../queries");

module.exports = function (app) { 

  // Fetch Memorial list
  app.get("/api/v1/memorial-list/", async (req, res) => {
    try {
      var MemorialList = await q.queryAllMemorials();
    } catch {
      console.log("Error encountered: queryAllMemorials");
    }
    res.json(MemorialList);
  })

  // Fetch specific Memorial
  app.get("/api/v1/memorials/:id", (req, res) => {
    const id = req.params.id
    db.Memorial.findOne({
      where: {
        id: id
      }
    }).then(function (memorial) {
      res.json(memorial);
    });
  })

  // Fetch combined data for a specific Memorial
  app.get("/api/v1/memorial-data/:id", async (req, res) => {
    const id = req.params.id
    try {
      var MemorialData = await q.queryMemorialData(id);
    } catch {
      console.log("Error encountered: queryMemorialData");
    }
    res.json(MemorialData);
  })



  // Fetch all active Categories
  app.get("/api/v1/categories/", (req, res) => {
    db.Category.findAll({
      where: {
        Active: 1
      }
    }).then(function (categories) {
      res.json(categories);
    });
  })

  // Fetch all Users
  app.get("/api/v1/users/", (req, res) => {
    db.User.findAll({ }).then(function (users) {
      res.json(users);
    });
  })

  // Fetch a specific User
  app.get("/api/v1/user/:id", (req, res) => {
    const id = req.params.id;
    db.User.findOne({
      where: {
        id: id
      }
    }).then(function (user) {
      res.json(user);
    });
  })

}