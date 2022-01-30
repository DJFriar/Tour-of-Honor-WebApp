const db = require("../../models");
const q = require("../../private/queries");

module.exports = function (app) { 
  // Fetch all Memorials
  app.get("/api/v1/memorials/", (req, res) => {
    db.Memorial.findAll({ }).then(function (memorials) {
      res.json(memorials);
    });
  })

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

  // Fetch a Memorial Text Entry
  app.get("/api/v1/memorial-text/:id", (req, res) => {
    const id = req.params.id;
    db.MemorialMeta.findAll({
      where: {
        MemorialID: id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
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

  // Fetch a specific Restriction
  app.get("/api/v1/restriction/:id", (req, res) => {
    const id = req.params.id;
    db.Restriction.findOne({
      where: {
        id: id
      }
    }).then(function (restriction) {
      res.json(restriction);
    });
  })
}