module.exports = function (app) {

  // ===============================================================================
  //#region CREATE (POST)
  // ===============================================================================

  app.post('/api/category', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/memorial-metadata");
  });

  app.post('/api/login', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    return true;
  });

  app.post('/api/memorial', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/aux-memorial-editor");
  });

  app.post('/api/pending-memorial', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/state-memorial-editor");
  });

  app.post('/api/restriction', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/memorial-metadata");
  });

  app.post('/api/user', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    return true;
  });

  //#endregion
  // ===============================================================================

  // ===============================================================================
  //#region READ (GET)
  // ===============================================================================

  app.get("/", async (req,res) => {
    res.render("pages/index");
  });

  app.get("/admin/aux-memorial-editor", async (req, res) => {
    var categoryData = [
      { "ID":"0", "Name":"Testing", "ShortCode":"TEST" },
      { "ID":"2", "Name":"Doughboy", "ShortCode": "DB" },
      { "ID":"3", "Name":"Huey", "ShortCode": "Huey" },
      { "ID":"4", "Name":"Gold Star Family", "ShortCode": "GSF" },
      { "ID":"5", "Name":"War Dogs", "ShortCode": "K9" },
      { "ID":"6", "Name":"Madonna of the Trail", "ShortCode": "MotT" },
      { "ID":"7", "Name":"9/11", "ShortCode": "9/11" }
    ]
    var auxMemorialData = [
      { "ID":1, "Code":"TX2", "Name":"Central Texas Veterans Memorial", "City":"Brownwood", "State":"TX", "Access":"24/7" },
      { "ID":2, "Code":"KS6", "Name":"Veterans Memorial", "City":"Stockton", "State":"KS", "Access":"24/7" }
    ]
    var restrictionData = [
      { "ID":"0", "Name":"None" },
      { "ID":"1", "Name":"Military Base" },
      { "ID":"2", "Name":"Private Property" },
      { "ID":"3", "Name":"Unavailable" },
      { "ID":"4", "Name":"Construction" }
    ]
    res.render("pages/admin/aux-memorial-editor", {
      categoryData,
      auxMemorialData,
      restrictionData
    });
  });
  
  app.get("/admin/memorial-metadata", async (req, res) => {
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
      categoryData,
      memorialData,
      restrictionData
    });
  });

  app.get("/admin/state-memorial-editor", async (req, res) => {
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
      pendingMemorialData,
      restrictionData,
      stateMemorialData
    });
  });

  app.get("/admin/user-management", async (req, res) => {
    var groupData = [
      { "ID":"1", "FlagNumber":"512", "FirstName":"Keisha", "LastName":"Perry", "Email":"keisha@hey.com", "Role":"Sponsor" }
    ]
    var sponsorData = [
      { "ID":"1", "FirstName":"Stevie", "LastName":"Nicks", "States":"AZ, CA" },
      { "ID":"2", "FirstName":"Billy", "LastName":"Gibbons", "States":"TX" }
    ]
    var userData = [
      { "ID":"1", "FlagNumber":"713", "FirstName":"Tommy", "LastName":"Craft", "Email":"tommy.craft@icloud.com", "Role":"Admin" },
      { "ID":"2", "FlagNumber":"512", "FirstName":"Keisha", "LastName":"Perry", "Email":"keisha@hey.com", "Role":"Sponsor" }
    ]
    res.render("pages/admin/user-management", {
      sponsorData,
      userData
    });
  });

  app.get("/livefeed", async (req,res) => {
    res.render("pages/livefeed");
  });

  app.get("/login", async (req, res) => {
    res.render("pages/login");
  });

  app.get("/memorials", async (req, res) => {
    var memorialData = [
      { "ID":1, "Code":"TX2", "Name":"Central Texas Veterans Memorial", "City":"Brownwood", "State":"TX", "Access":"24/7" },
      { "ID":2, "Code":"KS6", "Name":"Veterans Memorial", "City":"Stockton", "State":"KS", "Access":"24/7" }
    ]
    res.render("pages/memorials", {
      memorialData
    });
  });

  app.get("/signup", async (req, res) => {
    res.render("pages/signup");
  });

  app.get("/submit", async (req, res) => {
    var targetMemorial = [
      { "Memorial_ID":"2", "Category":"Gold Star Family", "Code":"GS005", "Name":"GSFMM - Layfayette Park", "City":"Albany", "State":"NY", "SampleImage":"GS005.jpg" },
    ]
    res.render("pages/submit", {
      targetMemorial
    });
  });

  app.get("/user-profile", async (req, res) => {
    res.render("pages/user-profile");
  });

  //#endregion
  // ===============================================================================

  // ===============================================================================
  //#region UPDATE (PUT)
  // ===============================================================================

  app.put('/api/category', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/memorial-metadata");
  });

  app.put('/api/memorial', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/aux-memorial-editor");
  });

  app.put('/pending-memorial', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/state-memorial-editor");
  });

  app.put('/api/restriction', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/memorial-metadata");
  });

  app.put('/api/user', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    return true;
  });

  //#endregion
  // ===============================================================================

  // ===============================================================================
  //#region DELETE (DELETE)
  // ===============================================================================

  app.delete('/api/category', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/memorial-metadata");
  });

  app.delete('/api/memorial', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/aux-memorial-editor");
  });

  app.delete('/api/pending-memorial', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/state-memorial-editor");
  });

  app.delete('/api/restriction', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    res.redirect("/admin/memorial-metadata");
  });

  app.delete('/api/user', function (req, res) {
    console.log("====== req.body ======");
    console.log(req.body);
    // Call API here
    return true;
  });

  //#endregion
  // ===============================================================================

}