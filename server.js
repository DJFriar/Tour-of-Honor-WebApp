require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");

// ==============================================================================
// CONFIGURATION
// ==============================================================================
const app = express();
const PORT = process.env.PORT || 3700;
const db = require("./models");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("static"));
app.use(express.static("private"));


// We need to use sessions to keep track of our user's login status
app.use(
  session({
    secret: process.env.SESSIONKEY,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ================================================================================
// ROUTES
// ================================================================================
require("./private/routes/routes")(app);
require("./private/routes/api-routes")(app);

// =============================================================================
// LISTENER
// =============================================================================
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
      );
    });
  })
