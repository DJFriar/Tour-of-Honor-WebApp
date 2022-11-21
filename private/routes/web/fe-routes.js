/* eslint-disable consistent-return */
const { DateTime } = require('luxon');
const q = require('../../queries');

const isAuthenticated = require('../../../config/isAuthenticated');
// const isAdmin = require('../../../config/isAdmin');
const { logger } = require('../../../controllers/logger');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

// eslint-disable-next-line func-names
module.exports = function (app) {
  const { baseSampleImageUrl } = app.locals;
  const { baseImageUrl } = app.locals;

  const orderSteps = [
    {
      StepIndex: 0,
      Title: 'Step 1',
      Subtitle: 'Rider Info',
      StepNumber: 1,
      Partial: 'riderInfo',
    },
    {
      StepIndex: 1,
      Title: 'Step 2',
      Subtitle: 'Bike Info',
      StepNumber: 2,
      Partial: 'bikeInfo',
    },
    {
      StepIndex: 2,
      Title: 'Step 3',
      Subtitle: 'Passenger Info',
      StepNumber: 3,
      Partial: 'passengerInfo',
    },
    {
      StepIndex: 3,
      Title: 'Step 4',
      Subtitle: 'Charity Choice',
      StepNumber: 4,
      Partial: 'charityChoice',
    },
    {
      StepIndex: 4,
      Title: 'Step 5',
      Subtitle: 'T-Shirts',
      StepNumber: 5,
      Partial: 't-shirt',
    },
    {
      StepIndex: 5,
      Title: 'Step 6',
      Subtitle: 'Payment',
      StepNumber: 6,
      Partial: 'payment',
    },
    {
      StepIndex: 6,
      Title: 'Step 7',
      Subtitle: 'Waiver',
      StepNumber: 7,
      Partial: 'waiver',
    },
    {
      StepIndex: 7,
      Title: 'Step 8',
      Subtitle: 'Flag Number',
      StepNumber: 8,
      Partial: 'flagNumber',
    },
  ];

  // ===============================================================================
  // #region READ (GET)
  // ===============================================================================

  app.get('/', async (req, res) => {
    res.redirect('/login');
  });

  app.get('/admin', isAuthenticated, async (req, res) => {
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

  app.get('/scoring/', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let PendingSubmissions;
    let TimeZone;
    if (req.user) {
      activeUser = true;
    }
    try {
      PendingSubmissions = await q.queryPendingSubmissions();
    } catch (err) {
      logger.error(`Error encountered: queryPendingSubmissions:${err}`);
    }
    try {
      TimeZone = await q.queryTimeZoneData(req.user.TimeZone);
    } catch (err) {
      logger.error('Error encountered: queryTimeZoneData');
    }
    res.locals.title = 'TOH Scoring Dashboard';
    res.render('pages/scoring', {
      activeUser,
      User: req.user,
      NotificationText: '',
      PendingSubmissions,
      TimeZone,
      dt: DateTime,
    });
  });

  app.get('/scored/', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let Submissions;
    let TimeZone;
    if (req.user) {
      activeUser = true;
    }
    try {
      Submissions = await q.queryScoredSubmissions();
    } catch (err) {
      logger.error(`Error encountered: queryScoredSubmissions:${err}`);
    }
    try {
      TimeZone = await q.queryTimeZoneData(req.user.TimeZone);
    } catch (err) {
      logger.error('Error encountered: queryTimeZoneData');
    }
    res.locals.title = 'TOH Scored';
    res.render('pages/scored', {
      activeUser,
      User: req.user,
      NotificationText: '',
      Submissions,
      TimeZone,
      dt: DateTime,
    });
  });

  app.get('/submission/undefined', isAuthenticated, async (req, res) => {
    res.redirect('/scoring');
  });

  app.get('/submission/:id', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let OtherFlags;
    let OtherRidersArray = [];
    let TimeZone;
    if (req.user) {
      activeUser = true;
    }
    const { id } = req.params;
    try {
      TimeZone = await q.queryTimeZoneData(req.user.TimeZone);
    } catch (err) {
      logger.error('Error encountered: queryTimeZoneData');
    }
    try {
      const Submissions = await q.queryAllSubmissions(id);
      if (Submissions.length === 0) {
        res.redirect('/error');
      } else {
        OtherFlags = Submissions[0].OtherRiders;
        OtherRidersArray = OtherFlags.split(',');
        res.locals.title = `TOH Submission ${id}`;
        res.render('pages/submission', {
          activeUser,
          User: req.user,
          NotificationText: '',
          baseImageUrl,
          baseSampleImageUrl,
          Submissions,
          OtherRidersArray,
          TimeZone,
          dt: DateTime,
        });
      }
    } catch (err) {
      logger.error(`queryAllSubmissions failed for id ${id}`, { calledBy: 'fe-routes.js' });
    }
  });

  app.get('/error', isAuthenticated, async (req, res) => {
    let activeUser = false;
    if (req.user) {
      activeUser = true;
    }
    res.locals.title = 'TOH Error';
    res.render('pages/error', {
      activeUser,
      User: req.user,
      NotificationText: '',
    });
  });

  app.get('/admin/alt-entry', isAuthenticated, async (req, res) => {
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

  app.get('/admin/memorial-editor', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let categoryData;
    let MemorialData;
    let restrictionData;
    if (req.user) {
      activeUser = true;
    }
    try {
      categoryData = await q.queryAllCategories();
    } catch (err) {
      logger.error('Error encountered: queryAllCategories');
    }
    try {
      MemorialData = await q.queryAllMemorials();
    } catch (err) {
      logger.error('Error encountered: queryAllMemorials');
    }
    try {
      restrictionData = await q.queryAllRestrictions();
    } catch (err) {
      logger.error('Error encountered: queryAllRestrictions');
    }
    res.locals.title = 'TOH Memorial Editor OLD';
    res.render('pages/admin/memorial-editor', {
      activeUser,
      User: req.user,
      baseImageUrl,
      baseSampleImageUrl,
      categoryData,
      MemorialData,
      restrictionData,
      NotificationText: '',
    });
  });

  app.get('/admin/memorial-editor2', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let categoryData;
    let MemorialData;
    let restrictionData;
    if (req.user) {
      activeUser = true;
    }
    try {
      categoryData = await q.queryAllCategories();
    } catch (err) {
      logger.error('Error encountered: queryAllCategories');
    }
    try {
      MemorialData = await q.queryAllMemorials();
    } catch (err) {
      logger.error('Error encountered: queryAllMemorials');
    }
    try {
      restrictionData = await q.queryAllRestrictions();
    } catch (err) {
      logger.error('Error encountered: queryAllRestrictions');
    }
    res.locals.title = 'TOH Memorial Editor';
    res.render('pages/admin/memorial-editor2', {
      activeUser,
      User: req.user,
      baseImageUrl,
      baseSampleImageUrl,
      categoryData,
      MemorialData,
      restrictionData,
      NotificationText: '',
    });
  });

  app.get('/admin/memorial-text/:memCode', isAuthenticated, async (req, res) => {
    const { memCode } = req.params;
    let activeUser = false;
    let MemorialData;
    let MemorialText;
    if (req.user) {
      activeUser = true;
    }
    try {
      MemorialData = await q.queryMemorial(memCode);
    } catch (err) {
      logger.error('Error encountered: queryMemorial');
    }
    try {
      MemorialText = await q.queryMemorialText(memCode);
    } catch (err) {
      logger.error('Error encountered: queryMemorialText');
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

  app.get('/admin/trophy-editor', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let AwardNames;
    let Awards;
    let Regions;
    let TrophyList;
    if (req.user) {
      activeUser = true;
    }
    try {
      Regions = await q.queryRegionList();
    } catch (err) {
      logger.error('Error encountered: queryRegionList');
    }
    try {
      TrophyList = await q.queryTrophiesList();
    } catch (err) {
      logger.error('Error encountered: queryTrophiesList');
    }
    try {
      AwardNames = await q.queryAwardNamesList();
    } catch (err) {
      logger.error('Error encountered: queryAwardNamesList');
    }
    try {
      Awards = await q.queryAwardList();
    } catch (err) {
      logger.error('Error encountered: queryAwardList');
    }
    res.locals.title = 'TOH Trophy Editor';
    res.render('pages/admin/trophy-editor', {
      activeUser,
      User: req.user,
      NotificationText: '',
      Awards,
      AwardNames,
      Regions,
      TrophyList,
    });
  });

  app.get('/admin/flag-manager', isAuthenticated, async (req, res) => {
    let activeUser = false;
    if (req.user) {
      activeUser = true;
    }
    res.locals.title = 'TOH Flag Manager';
    res.render('pages/admin/flag-manager', {
      activeUser,
      User: req.user,
      NotificationText: '',
    });
  });

  app.get('/admin/rider-management', isAuthenticated, async (req, res) => {
    let activeUser = false;
    // let Users;
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
      sponsorData,
      NotificationText: '',
    });
  });

  app.get('/admin/group-management', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let Groups;
    if (req.user) {
      activeUser = true;
    }
    try {
      Groups = await q.queryAllGroups();
    } catch (err) {
      logger.error('Error encountered: queryAllGroups');
    }
    res.locals.title = 'TOH Group Manager';
    res.render('pages/admin/group-management', {
      activeUser,
      User: req.user,
      Groups,
      NotificationText: '',
    });
  });

  app.get('/changelog', async (req, res) => {
    let activeUser = false;
    if (req.user) {
      activeUser = true;
    }
    res.locals.title = 'TOH Changelog';
    res.render('pages/changelog', {
      activeUser,
      User: req.user,
      NotificationText: '',
    });
  });

  app.get('/disabled', async (req, res) => {
    res.locals.title = 'TOH Site Disabled';
    res.render('pages/disabled', {
      NotificationText: '',
    });
  });

  app.get('/forgotpassword', async (req, res) => {
    res.locals.title = 'TOH Forgot Password';
    res.render('pages/forgot-password', {
      NotificationText: '',
      UserID: 0,
      TokenValidity: [{ Valid: 2 }],
    });
  });

  app.get('/forgotpassword/:id/:token', async (req, res) => {
    const UserID = req.params.id;
    const Token = req.params.token;
    let TokenValidity;
    try {
      TokenValidity = await q.queryTokenValidity(UserID, Token);
    } catch (err) {
      logger.error('Error encountered: queryTokenValidity');
    }
    res.locals.title = 'TOH Forgot Password';
    res.render('pages/forgot-password', {
      NotificationText: '',
      UserID,
      TokenValidity,
    });
  });

  app.get('/livefeed', async (req, res) => {
    let activeUser = false;
    if (req.user) {
      activeUser = true;
    }
    res.locals.title = 'TOH Live Feed';
    res.render('pages/livefeed', {
      activeUser,
      User: req.user,
      NotificationText: '',
    });
  });

  // Enable this to put the site in maintence mode
  // app.get("/login", async (req,res) => {
  //   res.redirect('/disabled');
  // });

  app.get('/login', async (req, res) => {
    res.locals.title = 'TOH Login';
    res.render('pages/login', {
      NotificationText: '',
    });
  });

  app.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        logger.error('Error while logging out.');
        return next(err);
      }
      res.redirect('/');
    });
  });

  app.get('/memorials', async (req, res) => {
    let activeUser = false;
    let Memorials;
    if (req.user) {
      activeUser = true;
    }
    try {
      Memorials = await q.queryAllAvailableMemorials();
    } catch (err) {
      logger.error('Error encountered: queryAllAvailableMemorials');
    }
    res.locals.title = 'TOH Memorial List';
    res.render('pages/memorials', {
      activeUser,
      User: req.user,
      NotificationText: '',
      Memorials,
    });
  });

  app.get('/memorial/:memCode', async (req, res) => {
    const { memCode } = req.params;
    let activeUser = false;
    let isAvailableToSubmit = false;
    let isMemorialInSubmissions = false;
    let isMemorialInXref = false;
    let memID = 0;
    let MemorialData;
    let MemorialStatus = 0;
    let MemorialText;
    let SubmissionStatus = [];
    let UserData = [];

    try {
      const memIDResponse = await q.queryMemorialIDbyMemCode(memCode);
      memID = memIDResponse[0].id;
    } catch (error) {
      logger.error('Error encountered when getting memorial ID.');
    }
    try {
      MemorialData = await q.queryMemorial(memCode);
    } catch (err) {
      logger.error('Error encountered: queryMemorial');
    }
    try {
      MemorialText = await q.queryMemorialText(memCode);
    } catch (err) {
      logger.error('Error encountered: queryMemorialText');
    }

    if (req.user) {
      activeUser = true;
      UserData = req.user;
      try {
        const MemorialStatusResponse = await q.queryMemorialStatusByRider(
          req.user.FlagNumber,
          memID,
        );
        if (MemorialStatusResponse.length > 0) {
          MemorialStatus = MemorialStatusResponse[0].id;
          isMemorialInXref = true;
        } else {
          MemorialStatus = 0;
        }
      } catch (err) {
        logger.error('Error encountered: queryMemorialStatusByRider');
      }
      try {
        SubmissionStatus = await q.querySubmissionStatusByRider(req.user.id, memCode);
        if (SubmissionStatus.length > 0 && SubmissionStatus[0].Status !== 2) {
          isMemorialInSubmissions = true;
        }
      } catch (err) {
        logger.error('Error encountered: querySubmissionStatusByRider');
      }
      if (!isMemorialInXref && !isMemorialInSubmissions) {
        isAvailableToSubmit = true;
      }
    }

    if (SubmissionStatus.length === 0) {
      SubmissionStatus.unshift({ Status: 4 });
    }
    res.locals.title = `TOH Memorial - ${memCode}`;
    res.render('pages/memorial', {
      activeUser,
      User: UserData,
      NotificationText: '',
      baseImageUrl,
      baseSampleImageUrl,
      isAvailableToSubmit,
      MemorialData,
      MemorialStatus,
      MemorialText,
      SubmissionStatus,
    });
  });

  app.get('/secretdoor', async (req, res) => {
    res.locals.title = 'TOH Secret Door';
    res.render('pages/secretdoor', {
      NotificationText: '',
    });
  });

  app.get('/signup', async (req, res) => {
    res.locals.title = 'TOH Signup';
    res.render('pages/signup', {
      NotificationText: '',
    });
  });

  app.get('/submit', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let Categories;
    if (req.user) {
      activeUser = true;
    }
    try {
      Categories = await q.queryAllCategories();
    } catch (err) {
      logger.error('Error encountered: queryAllCategories');
    }

    const targetMemorial = [
      {
        Memorial_ID: '2',
        Category: 'Gold Star Family',
        Code: 'GS005',
        Name: 'GSFMM - Layfayette Park',
        City: 'Albany',
        State: 'NY',
        SampleImage: 'GS005.jpg',
      },
      {
        Memorial_ID: '3',
        Category: 'Huey',
        Code: 'H802',
        Name: '159220 - AH-1J SeaCobra',
        City: 'Addison',
        State: 'TX',
        SampleImage: 'H802.jpg',
      },
    ];
    res.locals.title = 'TOH Submit';
    res.render('pages/submit', {
      activeUser,
      User: req.user,
      targetMemorial,
      NotificationText: '',
      Categories,
    });
  });

  app.get('/welcome', async (req, res) => {
    res.locals.title = 'TOH Rider Onboarding';
    res.render('pages/welcome-rider', {
      NotificationText: '',
      ValidateNewRider: [{ id: 0 }],
    });
  });

  app.get('/welcome/:username', async (req, res) => {
    const UserName = req.params.username;
    let ValidateNewRider;
    try {
      ValidateNewRider = await q.queryNewRiderValidation(UserName);
    } catch (err) {
      logger.error('Error encountered: queryNewRiderValidation');
    }
    if (!ValidateNewRider[0]) {
      res.redirect('/welcome');
    } else {
      res.locals.title = 'TOH Rider Onboarding';
      res.render('pages/welcome-rider', {
        NotificationText: '',
        ValidateNewRider,
      });
    }
  });

  app.get('/riders', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let riderList;
    let totalEarnedByRider;
    if (req.user) {
      activeUser = true;
    }
    try {
      riderList = await q.queryAllRiders();
    } catch (err) {
      logger.error('Error encountered: queryAllRiders');
    }
    try {
      totalEarnedByRider = await q.queryEarnedMemorialsByAllRiders();
    } catch (err) {
      logger.error('Error encountered: queryEarnedMemorialsByAllRiders');
    }
    res.locals.title = 'TOH Rider List';
    res.render('pages/rider-list', {
      activeUser,
      User: req.user,
      NotificationText: '',
      riderList,
      totalEarnedByRider,
    });
  });

  app.get('/stats', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let totalEarnedByRider;
    if (req.user) {
      activeUser = true;
    }
    try {
      totalEarnedByRider = await q.queryEarnedMemorialsByAllRiders();
    } catch (err) {
      logger.error('Error encountered: queryEarnedMemorialsByAllRiders');
    }
    res.locals.title = 'TOH Stats';
    res.render('pages/stats', {
      activeUser,
      User: req.user,
      NotificationText: '',
      totalEarnedByRider,
    });
  });

  app.get('/trophies', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let Regions;
    let TrophyList;
    if (req.user) {
      activeUser = true;
    }
    try {
      Regions = await q.queryRegionList();
    } catch (err) {
      logger.error('Error encountered: queryRegionList');
    }
    try {
      TrophyList = await q.queryTrophiesList();
    } catch (err) {
      logger.error('Error encountered: queryTrophiesList');
    }
    res.locals.title = 'TOH Trophy List';
    res.render('pages/trophies', {
      activeUser,
      User: req.user,
      NotificationText: '',
      Regions,
      TrophyList,
    });
  });

  app.get('/user-profile', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let RiderSubmissionHistory;
    let RiderBikeInfo;
    let TimeZone;
    if (req.user) {
      activeUser = true;
    }
    try {
      RiderSubmissionHistory = await q.querySubmissionsByRider(req.user.id);
    } catch (err) {
      logger.error('Error encountered: querySubmissionsByRider');
    }
    try {
      RiderBikeInfo = await q.queryAllBikes(req.user.id);
    } catch (err) {
      logger.error('Error encountered: queryAllBikes');
    }
    try {
      TimeZone = await q.queryTimeZoneData(req.user.TimeZone);
    } catch (err) {
      logger.error('Error encountered: queryTimeZoneData');
    }

    res.locals.title = 'TOH User Profile';
    res.render('pages/user-profile', {
      activeUser,
      User: req.user,
      NotificationText: '',
      RiderSubmissionHistory,
      RiderBikeInfo,
      TimeZone,
      dt: DateTime,
    });
  });

  app.get('/public-profile', async (req, res) => {
    let activeUser = false;
    if (req.user) {
      activeUser = true;
    }

    res.render('pages/public-profile', {
      activeUser,
      NotificationText: '',
      dt: DateTime,
    });
  });

  app.get('/registration', async (req, res) => {
    let activeUser = false;
    let BaseRiderRate;
    let Charities;
    let OrderInfo;
    let OrderInfoArray = [];
    let PassengerSurcharge;
    let RiderBikeInfo;
    let ShirtSizeSurcharge;
    let ShirtStyleSurcharge;
    let TotalOrderCost;
    let WaiverName;

    if (req.user) {
      activeUser = true;
    }
    if (!req.user) {
      return res.redirect('/signup');
    }

    if (process.env.NODE_ENV === 'Production') {
      WaiverName = `toh${process.env.CURRENT_RALLY_YEAR}prod`;
    } else {
      WaiverName = `toh${process.env.CURRENT_RALLY_YEAR}test`;
    }

    try {
      OrderInfoArray = await q.queryOrderInfoByRider(req.user.id, 2023);
      OrderInfo = OrderInfoArray[0];
      console.log('==== OrderInfo ====');
      console.log(OrderInfo);
      // Check if Passenger has an existing flag number.
      if (OrderInfo.PassUserID && OrderInfo.PassUserID > 0) {
        try {
          const passFlagNum = await q.queryFlagNumFromUserID(OrderInfo.PassUserID, 2022);
          if (passFlagNum && passFlagNum.FlagNumber > 0) {
            OrderInfo.dataValues.PassFlagNum = passFlagNum.FlagNumber;
            OrderInfo.PassFlagNum = passFlagNum.FlagNumber;
          } else {
            OrderInfo.dataValues.PassFlagNum = 0;
            OrderInfo.PassFlagNum = 0;
          }
        } catch (err) {
          logger.error(`Error encountered: queryFlagNumFromUserID ${err}`);
        }
      }
    } catch (err) {
      logger.error(`Error encountered: queryOrderInfoByRider ${err}`);
    }

    if (!OrderInfo || OrderInfo.length === 0) {
      OrderInfo = {};
      OrderInfo.NextStepNum = 0;
      OrderInfo.PassUserID = 0;
    }

    try {
      TotalOrderCost = await q.queryTotalOrderCostByRider(req.user.id);
    } catch (err) {
      logger.error(`Error encountered: queryTotalOrderCostByRider ${err}`);
    }
    if (!TotalOrderCost || TotalOrderCost.length === 0) {
      TotalOrderCost = [];
      TotalOrderCost.push({ Price: 0 });
    }

    try {
      const BaseRiderRateObject = await q.queryBaseRiderRate();
      BaseRiderRate = BaseRiderRateObject[0].Price;
      const PassengerSurchargeObject = await q.queryPassengerSurcharge();
      PassengerSurcharge = PassengerSurchargeObject[0].iValue;
      const ShirtSizeSurchargeObject = await q.queryShirtSizeSurcharge();
      ShirtSizeSurcharge = ShirtSizeSurchargeObject[0].iValue;
      const ShirtStyleSurchargeObject = await q.queryShirtStyleSurcharge();
      ShirtStyleSurcharge = ShirtStyleSurchargeObject[0].iValue;
    } catch (err) {
      logger.error(`Error encountered while gathering pricing info.${err}`);
    }

    try {
      Charities = await q.queryAllCharities();
    } catch (err) {
      logger.error(`Error encountered: queryAllCharities${err}`);
    }

    try {
      RiderBikeInfo = await q.queryBikesByRider(req.user.id);
    } catch (err) {
      logger.error(`Error encountered: queryBikesByRider${err}`);
    }

    // Check for Rider Waiver info
    if (OrderInfo.UserID > 0) {
      try {
        const RiderWaiverInfo = await q.queryWaiverIDByUser(OrderInfo.UserID);
        OrderInfo.RiderWaiverID = RiderWaiverInfo.WaiverID;
      } catch (err) {
        logger.error(`Error encountered: Rider queryWaiverIDByUser${err}`);
      }
    } else {
      OrderInfo.RiderWaiverID = '';
    }

    // Check for Passenger Waiver info
    if (OrderInfo.PassUserID > 0) {
      try {
        const PassWaiverInfo = await q.queryWaiverIDByUser(OrderInfo.PassUserID);
        OrderInfo.PassengerWaiverID = PassWaiverInfo.WaiverID;
      } catch (err) {
        logger.error(`Error encountered: Rider queryWaiverIDByUser${err}`);
      }
    }

    res.locals.title = 'TOH Registration';
    res.render('pages/registration', {
      activeUser,
      User: req.user,
      NotificationText: '',
      BaseRiderRate,
      Charities,
      OrderInfo,
      OrderSteps: orderSteps,
      PassengerSurcharge,
      RiderBikeInfo,
      ShirtSizeSurcharge,
      ShirtStyleSurcharge,
      TotalOrderCost,
      WaiverName,
      dt: DateTime,
    });
  });

  app.get('/admin/orders', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let Orders;
    if (req.user) {
      activeUser = true;
    }
    try {
      Orders = await q.queryAllOrders();
    } catch (err) {
      logger.error('Error encountered: queryAllOrders');
    }

    res.locals.title = 'TOH Orders';
    res.render('pages/admin/orders', {
      activeUser,
      User: req.user,
      NotificationText: '',
      Orders,
      dt: DateTime,
    });
  });

  app.get('/admin/charity-manager', isAuthenticated, async (req, res) => {
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

  app.get('/admin/site-config', isAuthenticated, async (req, res) => {
    let activeUser = false;
    let Configs;
    if (req.user) {
      activeUser = true;
    }
    try {
      Configs = await q.queryAllConfigs();
    } catch (err) {
      logger.error('Error encountered: queryAllConfigs');
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

  app.get('/waiver-check/:userid', async (req, res) => {
    const { userid } = req.params;
    let activeUser = false;
    let WaiverID;
    if (req.user) {
      activeUser = true;
    }
    try {
      WaiverID = (await q.queryWaiverIDByUser(userid)) || '';
    } catch (err) {
      logger.error('Error encountered: queryWaiverIDByUser');
    }
    res.locals.title = 'TOH Waiver Check';
    res.render('pages/waiver-check', {
      activeUser,
      User: req.user,
      NotificationText: '',
      dt: DateTime,
      UserID: userid,
      WaiverID,
    });
  });

  app.get('/waiver-check', async (req, res) => {
    const userid = req.query.id;
    let activeUser = false;
    let OrderInfo;
    let WaiverID;
    if (req.user) {
      activeUser = true;
    }
    try {
      WaiverID = (await q.queryWaiverIDByUser(userid)) || '';
    } catch (err) {
      logger.error('Error encountered: queryWaiverIDByUser');
    }
    try {
      OrderInfo = await q.queryOrderInfoByRider(userid, 2023);
    } catch (err) {
      logger.error(`Error encountered: queryOrderInfoByRider ${err}`);
    }

    if (!OrderInfo || OrderInfo.length === 0) {
      OrderInfo = [];
      OrderInfo.push({ id: 0 });
      OrderInfo.push({ OrderNumber: 0 });
    }

    res.locals.title = 'TOH Waiver Check';
    res.render('pages/waiver-check', {
      activeUser,
      User: req.user,
      NotificationText: '',
      dt: DateTime,
      OrderInfo,
      UserID: userid,
      WaiverID,
    });
  });

  // #endregion
  // ===============================================================================
};
