/* eslint no-console: off */
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { collectDefaultMetrics } = require('prom-client');

const passport = require('./config/passport');

// ==============================================================================
// CONFIGURATION
// ==============================================================================
collectDefaultMetrics();

const app = express();
const PORT = process.env.PORT || 3700;
const db = require('./models');

app.locals.envName = process.env.NODE_ENV;
app.locals.envNameShort = process.env.NODE_ENV_SHORT;
app.locals.envIsProd = false;
app.locals.envIsDev = false;
app.locals.envIsTest = false;
app.locals.baseImageUrl = process.env.BASE_IMAGE_URL;
app.locals.baseSampleImageUrl = process.env.BASE_SAMPLE_IMAGE_URL;
app.locals.CurrentRallyYear = process.env.CURRENT_RALLY_YEAR;
app.locals.OrderingRallyYear = process.env.ORDERING_RALLY_YEAR;

if (process.env.IS_PROD === 'true') {
  app.locals.envIsProd = true;
}

if (process.env.NODE_ENV === 'Development') {
  app.locals.envIsDev = true;
}

if (process.env.NODE_ENV === 'Testing') {
  app.locals.envIsTest = true;
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('static'));
app.use(express.static('private'));

// We need to use sessions to keep track of our user's login status
app.use(
  session({
    secret: process.env.SESSIONKEY,
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (!req.envMode) {
    req.envMode = process.env.NODE_ENV_SHORT;
  }
  next();
});

// ================================================================================
// ROUTES
// ================================================================================
app.use(require('./routes'));

const memorial = require('./private/routes/app/memorial');
const memorials = require('./private/routes/app/memorials');
const restriction = require('./private/routes/app/restriction');
const scoring = require('./private/routes/app/scoring');
const submission = require('./private/routes/app/submission');

require('./private/routes/app/api-routes')(app);
require('./private/routes/web/be-routes')(app);
require('./private/routes/web/fe-routes')(app);

app.use('/api/v1/memorial', memorial);
app.use('/api/v1/memorials', memorials);
app.use('/api/v1/restriction', restriction);
app.use('/api/v1/scoring', scoring);
app.use('/api/v1/submission', submission);

// =============================================================================
// LISTENER
// =============================================================================
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log('\n');
    console.log(
      `==> 🌎  Server running in ${app.locals.envName} mode. isProd is ${app.locals.envIsProd}.`,
    );
    console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT,
      PORT,
    );
    console.log('\n');
  });
});
