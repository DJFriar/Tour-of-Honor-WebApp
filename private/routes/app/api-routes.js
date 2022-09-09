const db = require("../../../models");
const q = require("../../queries");

module.exports = function (app) { 

  // Fetch All Memorials
  app.get("/api/v1/memorial-list/", async (req, res) => {
    try {
      var MemorialList = await q.queryAllAvailableMemorials();
    } catch {
      console.log("Error encountered: queryAllAvailableMemorials");
    }
    res.json(MemorialList);
  })

  // Fetch Memorial list with User Status included
  app.get("/api/v1/memorial-list/:id", async (req, res) => {
    const id = req.params.id
    try {
      var MemorialList = await q.queryAllMemorialsWithUserStatus(id);
    } catch {
      console.log("Error encountered: queryAllAvailableMemorials");
    }
    res.json(MemorialList);
  })

  // Fetch Submission list
  app.get("/api/v1/scoring-list/", async (req, res) => {
    console.log("==== /scoring-list endpoint was hit ====");
    try {
      var SubmissionList = await q.queryPendingSubmissionsWithDetails();
    } catch {
      console.log("Error encountered: queryPendingSubmissionsWithDetails");
    }
    console.log(SubmissionList);
    res.json(SubmissionList);
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

  // Fetch all bikes for a given User
  app.get("/api/v1/bikes/:id", (req, res) => {
    const id = req.params.id;
    db.Bike.findAll({ 
      where: {
        user_id: id
      }
    }).then(function (bikes) {
      res.json(bikes);
    });
  })

}