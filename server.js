require("dotenv").config();

const express = require("express");

// ==============================================================================
// CONFIGURATION
// ==============================================================================
const app = express();
const PORT = process.env.PORT || 3700;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("static"));
app.use(express.static("private"));
// ================================================================================
// ROUTES
// ================================================================================
require("./private/routes")(app);

// =============================================================================
// LISTENER
// =============================================================================
app.listen(PORT, () => {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});