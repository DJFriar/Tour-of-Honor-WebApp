var path = require("path");
const db = require("../../../models");
const q = require("../../queries");
const { DateTime } = require("luxon");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../../../config/isAuthenticated");
const isAdmin = require("../../../config/isAdmin");

module.exports = function (app) {

  // ===============================================================================
  //#region READ (GET)
  // ===============================================================================

  // app.get("/", isAuthenticated, async (req,res) => {
  //   var activeUser = false
  //   if (req.user) { activeUser = true };
  //   res.render("pages/index", {
  //     activeUser,
  //     User: req.user,
  //     NotificationText: "There is no content here, yet."
  //   });
  // });

  app.get("/", async (req,res) => {
    res.redirect('/memorials');
  });

  app.get("/admin", isAuthenticated, async (req,res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    res.render("pages/admin", {
      activeUser,
      User: req.user,
      NotificationText: ""
    });
  });

  app.get("/scoring/", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var Submissions = await q.querySubmissions();
    } catch {
      console.log("Error encountered: querySubmissions");
    }
    res.render("pages/scoring", {
      activeUser,
      User: req.user,
      NotificationText: "",
      Submissions,
      dt: DateTime
    });
  });

  app.get("/submission/undefined", isAuthenticated, async (req, res) => {
    res.redirect("/scoring");
  })

  app.get("/submission/:id", isAuthenticated, async (req, res) => {
    OtherRidersArray = [];
    var activeUser = false
    if (req.user) { activeUser = true };
    const id = req.params.id;
    try {
      var Submissions = await q.querySubmissions(id);
      if (Submissions.length == 0) {
        res.redirect("/error");
      } else {
        OtherFlags = Submissions[0].OtherRiders;
        OtherRidersArray = OtherFlags.split(',');
        console.log("==== Submission Detail Data ====");
        console.log(Submissions);
        res.render("pages/submission", {
          activeUser,
          User: req.user,
          NotificationText: "",
          Submissions,
          OtherRidersArray,
          dt: DateTime
        });
      }
    } catch {
      console.log("querySubmissions failed for id " + id);
    }
  });

  app.get("/error", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    res.render("pages/error", {
      activeUser,
      User: req.user,
      NotificationText: ""
    });
  });

  app.get("/admin/memorial-editor", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var categoryData = await q.queryAllCategories();
    } catch {
      console.log("Error encountered: queryAllCategories");
    }
    try {
      var MemorialData = await q.queryAllMemorials();
    } catch {
      console.log("Error encountered: queryAllMemorials");
    }
    try {
      var restrictionData = await q.queryAllRestrictions();
    } catch {
      console.log("Error encountered: queryAllRestrictions");
    }
    res.render("pages/admin/memorial-editor", {
      activeUser,
      User: req.user,
      categoryData,
      MemorialData,
      restrictionData,
      NotificationText: ""
    });
  });

  app.get("/admin/memorial-text/:memCode", isAuthenticated, async (req, res) => {
    const memCode = req.params.memCode;
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var MemorialData = await q.queryMemorial(memCode);
    } catch {
      console.log("Error encountered: queryMemorial");
    }
    try {
      var MemorialText = await q.queryMemorialText(memCode);
    } catch {
      console.log("Error encountered: queryMemorialText");
    }
    res.render("pages/admin/memorial-text", {
      activeUser,
      User: req.user,
      MemorialData,
      MemorialText,
      NotificationText: ""
    });
  });

  app.get("/admin/memorial-metadata", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    var categoryData = [
      { "ID":"0", "Name":"Testing", "ShortCode":"TEST" },
      { "ID":"1", "Name":"Tour of Honor", "ShortCode": "TOH" },
      { "ID":"2", "Name":"Doughboy", "ShortCode": "DB" },
      { "ID":"3", "Name":"Huey", "ShortCode": "Huey" },
      { "ID":"4", "Name":"Gold Star Family", "ShortCode": "GSF" },
      { "ID":"5", "Name":"War Dogs", "ShortCode": "K9" },
      { "ID":"6", "Name":"Madonna of the Trail", "ShortCode": "MotT" },
      { "ID":"7", "Name":"9/11", "ShortCode": "9/11" }
    ]
    var memorialData = [
      { "ID":"1", "Memorial_ID":"2", "Heading":"About", "Text":"The 7,000-square-foot memorial aims to honor all fallen law enforcement officers, firefighters and medics in the region. Two walls hold the names of fallen first responders and another wall holds insignias of different agencies as well as their explanations. In the middle of the memorial is a statue featuring a law enforcement officer and a paramedic comforting a firefighter who has lost someone. This wonderful memorial is part of the sprawling Leroy Elmore Park with a lake, a perfect spot to remember First Responder heroes." },
    ]
    var restrictionData = [
      { "ID":"0", "Name":"None" },
      { "ID":"1", "Name":"Military Base" },
      { "ID":"2", "Name":"Private Property" },
      { "ID":"3", "Name":"Unavailable" },
      { "ID":"4", "Name":"Construction" }
    ]
    res.render("pages/admin/memorial-metadata", {
      activeUser,
      User: req.user,
      categoryData,
      memorialData,
      restrictionData,
      NotificationText: "",
    });
  });

  app.get("/admin/state-memorial-editor", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    var pendingMemorialData = [
      { "ID":1, "Name":"WW2 Memorial", "City":"Telluride", "State":"CO", "Access":"24/7" },
      { "ID":2, "Name":"Springfield Veterans Memorial", "City":"Springfield", "State":"MO", "Access":"Dusk to Dawn" }
    ]
    var restrictionData = [
      { "ID":"0", "Name":"None" },
      { "ID":"1", "Name":"Military Base" },
      { "ID":"2", "Name":"Private Property" },
      { "ID":"3", "Name":"Unavailable" },
      { "ID":"4", "Name":"Construction" }
    ]
    var stateMemorialData = [
      { "ID":1, "Code":"TX3", "Name":"Central Texas Veterans Memorial", "City":"Brownwood", "State":"TX", "Access":"24/7" },
      { "ID":2, "Code":"KS6", "Name":"Veterans Memorial", "City":"Stockton", "State":"KS", "Access":"24/7" }
    ]
    res.render("pages/admin/state-memorial-editor", {
      activeUser,
      User: req.user,
      pendingMemorialData,
      restrictionData,
      stateMemorialData,
      NotificationText: "",
    });
  });

  app.get("/admin/user-management", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var Users = await q.queryAllUsers();
    } catch {
      console.log("Error encountered: queryAllUsers");
    }
    var sponsorData = [
      { "ID":"1", "FirstName":"Stevie", "LastName":"Nicks", "States":"AZ, CA" },
      { "ID":"2", "FirstName":"Billy", "LastName":"Gibbons", "States":"TX" }
    ]
    res.render("pages/admin/user-management", {
      activeUser,
      User: req.user,
      sponsorData,
      Users,
      NotificationText: "",
    });
  });

  app.get("/forgotpassword", async (req,res) => {
    res.render("pages/forgot-password", {
      NotificationText: "",
      UserID: 0,
      TokenValidity: [{ "Valid":2 }]
    });
  })

  app.get("/forgotpassword/:id/:token", async (req,res) => {
    const UserID = req.params.id;
    const Token = req.params.token;
    try {
      var TokenValidity = await q.queryTokenValidity(UserID, Token);
    } catch {
      console.log("Error encountered: queryTokenValidity");
    }
    res.render("pages/forgot-password", {
      NotificationText: "",
      UserID,
      TokenValidity
    });
  })

  app.get("/livefeed", async (req,res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    res.render("pages/livefeed", {
      activeUser,
      User: req.user,
      NotificationText: "",
    });
  });

  app.get("/login", async (req, res) => {
    res.render("pages/login", {
      NotificationText: ""
    });
  });

  app.get("/memorials", async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var Memorials = await q.queryAllMemorials();
    } catch {
      console.log("Error encountered: queryAllMemorials");
    }
    res.render("pages/memorials", {
      activeUser,
      User: req.user,
      NotificationText: "",
      Memorials
    });
  });

  app.get("/memorial/:memCode", async (req, res) => {
    var activeUser = false;
    const memCode = req.params.memCode;
    try {
      var MemorialData = await q.queryMemorial(memCode);
    } catch {
      console.log("Error encountered: queryMemorial");
    }
    try {
      var MemorialText = await q.queryMemorialText(memCode);
    } catch {
      console.log("Error encountered: queryMemorialText");
    }
    var SubmissionStatus = [];
    var UserData = [];
    if (req.user) { 
      activeUser = true;
      UserData = req.user
      try {
        SubmissionStatus = await q.queryMemorialStatusByRider(req.user.id, memCode);
      } catch {
        console.log("Error encountered: queryMemorialStatusByRider");
      }
    };
    if(SubmissionStatus.length == 0) {
      SubmissionStatus.unshift({Status: 3});
    }
    res.render("pages/memorial", {
      activeUser,
      User: UserData,
      NotificationText: "",
      MemorialData,
      MemorialText,
      SubmissionStatus
    });
  });

  app.get("/signup", async (req, res) => {
    res.render("pages/signup", {
      NotificationText: ""
    });
  });

  app.get("/submit", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var Categories = await q.queryAllCategories();
    } catch {
      console.log("Error encountered: queryAllCategories");
    }

    var targetMemorial = [
      { "Memorial_ID":"2", "Category":"Gold Star Family", "Code":"GS005", "Name":"GSFMM - Layfayette Park", "City":"Albany", "State":"NY", "SampleImage":"GS005.jpg" },
      { "Memorial_ID":"3", "Category":"Huey", "Code":"H802", "Name":"159220 - AH-1J SeaCobra", "City":"Addison", "State":"TX", "SampleImage":"H802.jpg" },
    ]
    res.render("pages/submit", {
      activeUser,
      User: req.user,
      targetMemorial,
      NotificationText: "",
      Categories
    });
  });

  app.get("/welcome", async (req, res) => {
    res.render("pages/welcome-rider", {
      NotificationText: "",
      ValidateNewRider: [{ "id":0 }]
    });
  });

  app.get("/welcome/:username", async (req, res) => {
    const UserName = req.params.username
    try {
      var ValidateNewRider = await q.queryNewRiderValidation(UserName);
    } catch {
      console.log("Error encountered: queryNewRiderValidation");
    }
    if(!ValidateNewRider[0]) {
      res.redirect("/welcome");
    } else {
      res.render("pages/welcome-rider", {
        NotificationText: "",
        ValidateNewRider
      });
    }
  });

  app.get("/riders", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var riderList = await q.queryAllRiders();
    } catch {
      console.log("Error encountered: queryAllRiders");
    }
    try {
      var totalEarnedByRider = await q.queryEarnedMemorialsByAllRiders();
    } catch {
      console.log("Error encountered: queryEarnedMemorialsByAllRiders");
    }
    res.render("pages/rider-list", {
      activeUser,
      User: req.user,
      NotificationText: "",
      riderList,
      totalEarnedByRider
    });
  });

  app.get("/stats", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var totalEarnedByRider = await q.queryEarnedMemorialsByAllRiders();
    } catch {
      console.log("Error encountered: queryEarnedMemorialsByAllRiders");
    }

    res.render("pages/stats", {
      activeUser,
      User: req.user,
      NotificationText: "",
      totalEarnedByRider
    });
  });

  app.get("/user-profile", isAuthenticated, async (req, res) => {
    var activeUser = false;
    if (req.user) { activeUser = true };
    try {
      var RiderSubmissionHistory = await q.querySubmissionsByRider(req.user.id);
    } catch {
      console.log("Error encountered: querySubmissionsByRider");
    }
    try {
      var RiderBikeInfo = await q.queryAllBikes(req.user.id);
    } catch {
      console.log("Error encountered: queryAllBikes");
    }
    console.log(req.user);

    res.render("pages/user-profile", {
      activeUser,
      User: req.user,
      NotificationText: "Changes work, but they currently they are not visible until you logout and back in again. Bike info is still in progress.",
      RiderSubmissionHistory,
      RiderBikeInfo,
      dt: DateTime
    });
  });

  //#endregion
  // ===============================================================================

  // ===============================================================================
  //#region UPDATE (PUT)
  // ===============================================================================

  app.put('/pending-memorial', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/state-memorial-editor");
  });

  //#endregion
  // ===============================================================================  

}