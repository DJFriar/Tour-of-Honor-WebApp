var path = require("path");
const db = require("../../../models");
const q = require("../../queries");
const { DateTime } = require("luxon");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../../../config/isAuthenticated");
const isAdmin = require("../../../config/isAdmin");

module.exports = function (app) {

  const baseSampleImageUrl = app.locals.baseSampleImageUrl;
  const baseImageUrl = app.locals.baseImageUrl;

  // ===============================================================================
  //#region READ (GET)
  // ===============================================================================

  app.get("/", async (req,res) => {
    res.redirect('/login');
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
      var PendingSubmissions = await q.queryPendingSubmissions();
    } catch {
      console.log("Error encountered: queryPendingSubmissions");
    }
    console.log("==== PendingSubmissions ====");
    console.log(PendingSubmissions);
    res.render("pages/scoring", {
      activeUser,
      User: req.user,
      NotificationText: "",
      PendingSubmissions,
      dt: DateTime
    });
  });

  app.get("/scored/", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var Submissions = await q.queryScoredSubmissions();
    } catch {
      console.log("Error encountered: queryScoredSubmissions");
    }
    res.render("pages/scored", {
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
      var Submissions = await q.queryAllSubmissions(id);
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
          baseImageUrl,
          baseSampleImageUrl,
          Submissions,
          OtherRidersArray,
          dt: DateTime
        });
      }
    } catch {
      console.log("queryAllSubmissions failed for id " + id);
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

  app.get("/admin/alt-entry", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    // try {
    //   var Users = await q.queryAllUsers();
    // } catch {
    //   console.log("Error encountered: queryAllUsers");
    // }

    res.render("pages/admin/alt-entry", {
      activeUser,
      User: req.user,
      NotificationText: "",
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
      baseImageUrl,
      baseSampleImageUrl,
      categoryData,
      MemorialData,
      restrictionData,
      NotificationText: ""
    });
  });

  app.get("/admin/memorial-editor2", isAuthenticated, async (req, res) => {
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
    res.render("pages/admin/memorial-editor2", {
      activeUser,
      User: req.user,
      baseImageUrl,
      baseSampleImageUrl,
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

  app.get("/admin/trophy-editor", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var Regions = await q.queryRegionList();
    } catch {
      console.log("Error encountered: queryRegionList");
    }
    try {
      var TrophyList = await q.queryTrophiesList();
    } catch {
      console.log("Error encountered: queryTrophiesList");
    }
    try {
      var AwardNames = await q.queryAwardNamesList();
    } catch {
      console.log("Error encountered: queryAwardNamesList");
    }
    try {
      var Awards = await q.queryAwardList();
    } catch {
      console.log("Error encountered: queryAwardList");
    }

    res.render("pages/admin/trophy-editor", {
      activeUser,
      User: req.user,
      NotificationText: "",
      Awards,
      AwardNames,
      Regions,
      TrophyList
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

  app.get("/changelog", async (req,res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    res.render("pages/changelog", {
      activeUser,
      User: req.user,
      NotificationText: "",
    });
  });

  app.get("/disabled", async (req, res) => {
    res.render("pages/disabled", {
      NotificationText: ""
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

  // Enable this to put the site in maintence mode
  // app.get("/login", async (req,res) => {
  //   res.redirect('/disabled');
  // });

  app.get("/login", async (req, res) => {
    res.render("pages/login", {
      NotificationText: ""
    });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/memorials", async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var Memorials = await q.queryAllAvailableMemorials();
    } catch {
      console.log("Error encountered: queryAllAvailableMemorials");
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
    var memID = 0;
    var isMemorialInSubmissions = false;
    var isMemorialInXref = false;
    var isAvailableToSubmit = false;
    try {
      var memIDResponse = await q.queryMemorialIDbyMemCode(memCode);
      memID = memIDResponse[0].id;
    } catch (error) {
      console.log("Error encountered when getting memorial ID.");
    }
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
    var MemorialStatus = 0;
    var SubmissionStatus = [];
    var UserData = [];
    if (req.user) { 
      activeUser = true;
      UserData = req.user
      try {
        var MemorialStatusResponse = await q.queryMemorialStatusByRider(req.user.FlagNumber, memID);
        if (MemorialStatusResponse.length > 0) {
          MemorialStatus = MemorialStatusResponse[0].id;
          isMemorialInXref = true;
        } else {
          MemorialStatus = 0;
        }
      } catch {
        console.log("Error encountered: queryMemorialStatusByRider");
      }
      try {
        SubmissionStatus = await q.querySubmissionStatusByRider(req.user.id, memCode);
        if (SubmissionStatus.length > 0 && SubmissionStatus[0].Status != 2) { 
          isMemorialInSubmissions = true;
        }
      } catch {
        console.log("Error encountered: querySubmissionStatusByRider");
      }
      if (!isMemorialInXref && !isMemorialInSubmissions) { isAvailableToSubmit = true}
    };

    if(SubmissionStatus.length == 0) {
      SubmissionStatus.unshift({Status: 4});
    }

    res.render("pages/memorial", {
      activeUser,
      User: UserData,
      NotificationText: "",
      baseImageUrl,
      baseSampleImageUrl,
      isAvailableToSubmit,
      MemorialData,
      MemorialStatus,
      MemorialText,
      SubmissionStatus
    });
  });

  app.get("/secretdoor", async (req, res) => {
    res.render("pages/secretdoor", {
      NotificationText: ""
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

  app.get("/trophies", isAuthenticated, async (req, res) => {
    var activeUser = false
    if (req.user) { activeUser = true };
    try {
      var Regions = await q.queryRegionList();
    } catch {
      console.log("Error encountered: queryRegionList");
    }
    try {
      var TrophyList = await q.queryTrophiesList();
    } catch {
      console.log("Error encountered: queryTrophiesList");
    }

    res.render("pages/trophies", {
      activeUser,
      User: req.user,
      NotificationText: "",
      Regions,
      TrophyList
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
      NotificationText: "",
      RiderSubmissionHistory,
      RiderBikeInfo,
      dt: DateTime
    });
  });

  app.get("/public-profile", async (req, res) => {
    var activeUser = false;
    if (req.user) { activeUser = true };

    res.render("pages/public-profile", {
      activeUser,
      NotificationText: "",
      dt: DateTime
    });
  });

  app.get("/registration", isAuthenticated, async (req, res) => {
    var activeUser = false;
    if (req.user) { activeUser = true };
    console.log(req.user);

    res.render("pages/registration", {
      activeUser,
      User: req.user,
      NotificationText: "",
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