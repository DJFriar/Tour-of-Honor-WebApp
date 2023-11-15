/**
 * routes/web/admin.js
 *
 * @description:: Route file for the Admin section of the Web (front-end) sub-application. All routes with "/admin" come through here.
 *
 */

const WebAdminRouter = require('express').Router();

const { DateTime } = require('luxon');
const { logger } = require('../../controllers/logger');
const isLoggedIn = require('../../middleware/loggedInCheck');
const q = require('../../private/queries');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

// Restrict these routes only to those that are logged in.
// TODO: Change this to be only those that are admins.
WebAdminRouter.use(isLoggedIn);

WebAdminRouter.route('/').get(async (req, res) => {
  let activeUser = false;
  if (req.user) {
    activeUser = true;
  }

  res.locals.title = 'TOH Admin Home';
  res.render('pages/admin', {
    activeUser,
    User: req.user,
    NotificationText: '',
  });
});

WebAdminRouter.route('/alt-entry').get(async (req, res) => {
  let activeUser = false;
  if (req.user) {
    activeUser = true;
  }
  res.locals.title = 'TOH Alt Entry';
  res.render('pages/admin/alt-entry', {
    activeUser,
    User: req.user,
    NotificationText: '',
  });
});

WebAdminRouter.route('/bike-manager').get(async (req, res) => {
  let activeUser = false;
  if (req.user) {
    activeUser = true;
  }

  res.locals.title = 'TOH Bike Manager';
  res.render('pages/admin/bike-manager', {
    activeUser,
    User: req.user,
    NotificationText: '',
    dt: DateTime,
  });
});

WebAdminRouter.route('/charity-manager').get(async (req, res) => {
  let activeUser = false;
  if (req.user) {
    activeUser = true;
  }

  res.locals.title = 'TOH Charity Manager';
  res.render('pages/admin/charity-manager', {
    activeUser,
    User: req.user,
    NotificationText: '',
    dt: DateTime,
  });
});

WebAdminRouter.route('/flag-manager').get(async (req, res) => {
  let activeUser = false;
  if (req.user) {
    activeUser = true;
  }
  res.locals.title = 'TOH Flag Manager';
  res.render('pages/admin/flag-manager', {
    activeUser,
    User: req.user,
    currentRallyYear,
  });
});

WebAdminRouter.route('/group-management').get(async (req, res) => {
  let activeUser = false;
  let Groups;
  if (req.user) {
    activeUser = true;
  }
  try {
    Groups = await q.queryAllGroups();
  } catch (err) {
    logger.error(`Error encountered: queryAllGroups().${err}`, { calledFrom: 'fe-routes.js' });
  }
  res.locals.title = 'TOH Group Manager';
  res.render('pages/admin/group-management', {
    activeUser,
    User: req.user,
    Groups,
    NotificationText: '',
  });
});

WebAdminRouter.route('/manual-registration').get(async (req, res) => {
  let activeUser = false;
  let BikeMakes;
  let Charities;

  try {
    BikeMakes = await q.queryBikeMakesList();
  } catch (err) {
    logger.error(`Error encountered: queryBikeMakesList().${err}`, {
      calledFrom: 'fe-routes.js',
    });
  }

  try {
    Charities = await q.queryAllCharities();
  } catch (err) {
    logger.error(`Error encountered: queryAllCharities().${err}`, { calledFrom: 'fe-routes.js' });
  }

  if (req.user) {
    activeUser = true;
  }
  res.locals.title = 'TOH Manual Registration';
  res.render('pages/admin/manual-registration', {
    activeUser,
    User: req.user,
    NotificationText: '',
    BikeMakes,
    Charities,
  });
});

WebAdminRouter.route('/memorial-text/:memCode').get(async (req, res) => {
  const { memCode } = req.params;
  let activeUser = false;
  let MemID;
  let MemorialData;
  let MemorialText;
  if (req.user) {
    activeUser = true;
  }
  try {
    const memIDResponse = await q.queryMemorialIDbyMemCode(memCode);
    MemID = memIDResponse[0].id;
  } catch (err) {
    logger.error(`Error encountered: queryMemorialIDbyMemCode(${memCode}).${err}`, {
      calledFrom: 'fe-routes.js',
    });
  }
  try {
    MemorialData = await q.queryMemorial(MemID);
  } catch (err) {
    logger.error(`Error encountered: queryMemorial(${MemID}).${err}`, {
      calledFrom: 'fe-routes.js',
    });
  }
  try {
    MemorialText = await q.queryMemorialText(MemID);
  } catch (err) {
    logger.error(`Error encountered: queryMemorialText(${MemID}).${err}`, {
      calledFrom: 'fe-routes.js',
    });
  }
  res.locals.title = 'TOH Memorial Text';
  res.render('pages/admin/memorial-text', {
    activeUser,
    User: req.user,
    MemorialData,
    MemorialText,
    NotificationText: '',
  });
});

WebAdminRouter.route('/orders').get(async (req, res) => {
  let activeUser = false;
  let Orders;
  let UserTimeZone;
  if (req.user) {
    activeUser = true;
  }

  try {
    Orders = await q.queryAllOrders();
  } catch (err) {
    logger.error(`Error encountered: queryAllOrders().${err}`, { calledFrom: 'fe-routes.js' });
  }

  try {
    UserTimeZone = await q.queryTimeZoneData(req.user.TimeZone);
  } catch (err) {
    logger.error(`Error encountered: queryTimeZoneData().${err}`, {
      calledFrom: 'fe-routes.js',
    });
  }

  res.locals.title = 'TOH Orders';
  res.render('pages/admin/orders', {
    activeUser,
    User: req.user,
    NotificationText: '',
    Orders,
    UserTimeZone,
    dt: DateTime,
  });
});

WebAdminRouter.route('/rider-management').get(async (req, res) => {
  let activeUser = false;
  if (req.user) {
    activeUser = true;
  }
  const sponsorData = [
    { ID: '1', FirstName: 'Stevie', LastName: 'Nicks', States: 'AZ, CA' },
    { ID: '2', FirstName: 'Billy', LastName: 'Gibbons', States: 'TX' },
  ];
  res.locals.title = 'TOH Rider Manager';
  res.render('pages/admin/rider-management', {
    activeUser,
    User: req.user,
    currentRallyYear,
    sponsorData,
  });
});

WebAdminRouter.route('/site-config').get(async (req, res) => {
  let activeUser = false;
  let Configs;
  if (req.user) {
    activeUser = true;
  }
  try {
    Configs = await q.queryAllConfigs();
  } catch (err) {
    logger.error(`Error encountered: queryAllConfigs()`);
  }

  res.locals.title = 'TOH Site Config';
  res.render('pages/admin/site-config', {
    activeUser,
    User: req.user,
    NotificationText: '',
    Configs,
    dt: DateTime,
  });
});

WebAdminRouter.route('/trophy-editor').get(async (req, res) => {
  let activeUser = false;
  let AwardNames;
  let Regions;
  let TrophyList;
  if (req.user) {
    activeUser = true;
  }
  try {
    Regions = await q.queryRegionList();
  } catch (err) {
    logger.error(`Error encountered: queryRegionList().${err}`, { calledFrom: 'fe-routes.js' });
  }
  try {
    TrophyList = await q.queryTrophiesList();
  } catch (err) {
    logger.error(`Error encountered: queryTrophiesList().${err}`, { calledFrom: 'fe-routes.js' });
  }
  try {
    AwardNames = await q.queryAwardNamesList();
  } catch (err) {
    logger.error(`Error encountered: queryAwardNamesList().${err}`, {
      calledFrom: 'fe-routes.js',
    });
  }
  res.locals.title = 'TOH Trophy Editor';
  res.render('pages/admin/trophy-editor', {
    activeUser,
    User: req.user,
    NotificationText: '',
    AwardNames,
    Regions,
    TrophyList,
  });
});

module.exports = WebAdminRouter;
