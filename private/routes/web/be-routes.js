/* eslint-disable no-console */
/* eslint-disable consistent-return */
const ejs = require('ejs');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// const multer = require('multer');
const fetch = require('node-fetch');
// const { getDefaultSettings } = require('http2');
// const Shopify = require('shopify-api');
const { register } = require('prom-client');

const db = require('../../../models');
const q = require('../../queries');
const uploadSubmission = require('../../../controllers/uploadSubmission');
const passport = require('../../../config/passport');
// const isAuthenticated = require('../../../config/isAuthenticated');
const sendEmail = require('../../sendEmail');
const { logger } = require('../../../controllers/logger');
const {
  generateShopifyCheckout,
  checkOrderStatusByCheckoutID,
} = require('../../../controllers/shopify');
const twilio = require('../../../controllers/twilio');
const { addSubscriber } = require('../../../controllers/mailchimp');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;
const serverApiKey = process.env.TOH_API_KEY;

// eslint-disable-next-line func-names
module.exports = function (app) {
  // Handle Metric Reporting
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  });

  // Handle Sample Image Updates
  app.post(
    '/update-sample-image',
    uploadSubmission.uploadImages,
    uploadSubmission.handleSampleImage,
    (req, res) => {
      db.Memorial.update(
        {
          Code: req.body.EditMemorialCode.toUpperCase(),
          Name: req.body.EditMemorialName,
          Category: req.body.EditMemorialCategory,
          Region: req.body.EditMemorialRegion,
          Latitude: req.body.EditMemorialLatitude,
          Longitude: req.body.EditMemorialLongitude,
          Address1: req.body.EditMemorialAddress1,
          Address2: req.body.EditMemorialAddress2,
          City: req.body.EditMemorialCity,
          State: req.body.EditMemorialState.toUpperCase(),
          URL: req.body.EditMemorialURL,
          Access: req.body.EditMemorialAccess,
          MultiImage: req.body.EditMultiImage,
          SampleImage: req.body.EditSampleImageName,
          Restrictions: req.body.EditMemorialRestrictions,
        },
        {
          where: { id: req.body.EditMemorialID },
        },
      ).then(() => {
        res.redirect('/admin/memorial-editor2');
      });
    },
  );

  // Find a Random Available Flag Number
  app.get('/api/v1/randomAvailableFlag', (req, res) => {
    db.Flag.findAll({
      where: {
        RallyYear: currentRallyYear,
      },
      raw: true,
    }).then((flags) => {
      const allowedNumbers = _.range(11, 1201, 1);
      const badNumbers = flags.map((inUse) => inUse.FlagNumber);
      const goodNumbers = _.pullAll(allowedNumbers, badNumbers);
      const randomFlag = goodNumbers[Math.floor(Math.random() * goodNumbers.length)];
      res.json(randomFlag);
    });
  });

  // Check Email Validity
  app.get('/api/v1/email/:email', (req, res) => {
    const { email } = req.params;
    db.User.findOne({
      where: {
        Email: email,
      },
    }).then((dbPost) => {
      res.json(dbPost);
    });
  });

  //
  // Memorial Info Related
  //

  // Create a Memorial
  app.post('/api/v1/memorial', (req, res) => {
    db.Memorial.create({
      Code: req.body.MemorialCode.toUpperCase(),
      Name: req.body.MemorialName,
      Category: req.body.MemorialCategory,
      Region: req.body.MemorialRegion,
      Latitude: req.body.MemorialLatitude,
      Longitude: req.body.MemorialLongitude,
      Address1: req.body.MemorialAddress1,
      Address2: req.body.MemorialAddress2,
      City: req.body.MemorialCity,
      State: req.body.MemorialState.toUpperCase(),
      URL: req.body.MemorialURL,
      Access: req.body.MemorialAccess,
      MultiImage: req.body.MultiImage,
      SampleImage: req.body.SampleImage,
      Restrictions: req.body.MemorialRestrictions,
      RallyYear: currentRallyYear,
    }).then(() => {
      res.redirect('/admin/memorial-editor');
    });
  });

  // Create a Memorial - Alternate Version
  app.post('/api/v1/memorial2', (req, res) => {
    db.Memorial.create({
      Code: req.body.MemorialCode.toUpperCase(),
      Name: req.body.MemorialName,
      Category: req.body.MemorialCategory,
      Region: req.body.MemorialRegion,
      Latitude: req.body.MemorialLatitude,
      Longitude: req.body.MemorialLongitude,
      Address1: req.body.MemorialAddress1,
      Address2: req.body.MemorialAddress2,
      City: req.body.MemorialCity,
      State: req.body.MemorialState.toUpperCase(),
      URL: req.body.MemorialURL,
      Access: req.body.MemorialAccess,
      MultiImage: req.body.MultiImage,
      SampleImage: req.body.SampleImage,
      Restrictions: req.body.MemorialRestrictions,
      RallyYear: currentRallyYear,
    }).then(() => {
      res.redirect('/admin/memorial-editor2');
    });
  });

  // Fetch a Memorial by ID
  app.get('/api/v1/memorial/:id', (req, res) => {
    const { id } = req.params;
    db.Memorial.findOne({
      where: {
        id,
      },
    }).then((dbPost) => {
      res.json(dbPost);
    });
  });

  // Fetch a Memorial by Code
  app.get('/api/v1/memorial/c/:code', (req, res) => {
    const { code } = req.params;
    db.Memorial.findOne({
      where: {
        Code: code,
        RallyYear: currentRallyYear,
      },
    }).then((dbPost) => {
      res.json(dbPost);
    });
  });

  // Update a Memorial
  app.put('/api/v1/memorial', (req, res) => {
    db.Memorial.update(
      {
        Code: req.body.Code.toUpperCase(),
        Name: req.body.Name,
        Category: req.body.Category,
        Region: req.body.Region,
        Latitude: req.body.Latitude,
        Longitude: req.body.Longitude,
        Address1: req.body.Address1,
        Address2: req.body.Address2,
        City: req.body.City,
        State: req.body.State.toUpperCase(),
        URL: req.body.URL,
        Access: req.body.Access,
        MultiImage: req.body.MultiImage,
        SampleImage: req.body.SampleImage,
        Restrictions: req.body.Restrictions,
      },
      {
        where: { id: req.body.MemorialID },
      },
    );
    res.send('success');
  });

  // Delete a Memorial
  app.delete('/api/v1/memorial/:id', (req, res) => {
    const { id } = req.params;
    db.Memorial.destroy({
      where: {
        id,
      },
    }).then(() => {
      res.status(202).send();
    });
  });

  //
  // Memorial Text Related
  //

  // Create a Memorial Text Entry
  app.post('/api/v1/memorial-text', (req, res) => {
    db.MemorialMeta.create({
      MemorialID: req.body.MemorialID,
      Heading: req.body.Heading,
      Text: req.body.Text,
    }).then(() => {
      res.redirect('back');
    });
  });

  // Fetch a Memorial Text Entry
  app.get('/api/v1/memorial-text/:id', (req, res) => {
    const { id } = req.params;
    db.MemorialMeta.findOne({
      where: {
        id,
      },
    }).then((memorialMetaText) => {
      res.json(memorialMetaText);
    });
  });

  // Update a Memorial Text Entry
  app.put('/api/v1/memorial-text', (req, res) => {
    db.MemorialMeta.update(
      {
        MemorialID: req.body.MemorialID,
        Heading: req.body.Heading,
        Text: req.body.Text,
      },
      {
        where: { id: req.body.id },
      },
    );
    res.send('success');
  });

  // Delete a Memorial Text Entry
  app.delete('/api/v1/memorial-text/:id', (req, res) => {
    const { id } = req.params;
    db.MemorialMeta.destroy({
      where: {
        id,
      },
    }).then(() => {
      res.status(202).send();
    });
  });

  //
  // Authentication Related
  //

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/v1/user', (req, res) => {
    db.User.create({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      UserName: req.body.UserName,
      Email: req.body.Email.toLowerCase(),
      Password: req.body.Password,
    })
      .then((x) => {
        db.Flag.create({
          FlagNumber: req.body.FlagNumber,
          UserID: x.id,
          RallyYear: currentRallyYear,
        }).then((y) => {
          logger.debug(`User Created Successfully`, { calledFrom: 'be-routes.js' });
          res.status(202).json(y);
        });
      })
      .catch((err) => {
        logger.error(`Signup API Error Encountered${err}`, { calledFrom: 'be-routes.js' });
        res.status(401).json(err);
      });
  });

  // Send welcome email to newly registered email
  app.post('/api/v1/welcomeemail', async (req, res) => {
    const { UserName } = req.body;
    try {
      const WelcomeLink = `${process.env.BASE_URL}/welcome/${UserName}`;
      const ScoringPortalLink = `${process.env.BASE_URL}`;
      const emailBody = await ejs.renderFile('./views/emails/emailRiderWelcome.ejs', {
        FirstName: req.body.FirstName,
        Email: req.body.Email,
        FlagNumber: req.body.FlagNumber,
        ShirtStyle: req.body.ShirtStyle,
        ShirtSize: req.body.ShirtSize,
        EmailNotes: req.body.EmailNotes,
        PassengerFirstName: req.body.PassengerFirstName,
        PassengerEmail: req.body.PassengerEmail,
        PassengerFlagNumber: req.body.PassengerFlagNumber,
        PassengerShirtStyle: req.body.PassengerShirtStyle,
        PassengerShirtSize: req.body.PassengerShirtSize,
        URL: WelcomeLink,
        PortalURL: ScoringPortalLink,
      });
      await sendEmail(
        req.body.Email,
        'Welcome to the Tour of Honor [IMPORTANT, PLEASE READ]',
        emailBody,
      );
      res.send('Welcome Email Sent');
    } catch (err) {
      logger.error(`An error occured while sending the welcome email: ${err}`, {
        calledFrom: 'be-routes.js',
      });
      res.send('An error occurred while sending welcome email.');
    }
  });

  // Send a portal sign up email
  app.post('/api/v1/portalemail', async (req, res) => {
    const { UserName } = req.body;
    try {
      const WelcomeLink = `${process.env.BASE_URL}/welcome/${UserName}`;
      const ScoringPortalLink = `${process.env.BASE_URL}`;
      const emailBody = await ejs.renderFile('./views/emails/emailProfileRegistration.ejs', {
        FirstName: req.body.FirstName,
        Email: req.body.Email,
        FlagNumber: req.body.FlagNumber,
        URL: WelcomeLink,
        PortalURL: ScoringPortalLink,
      });
      await sendEmail(
        req.body.Email,
        'Tour of Honor Scoring Portal Registration [IMPORTANT, PLEASE READ]',
        emailBody,
      );
      res.send('Portal Email Sent');
    } catch (err) {
      res.send('An error occurred while sending portal email.');
      logger.error(`An error occured while sending the portal email: ${err}`, {
        calledFrom: 'be-routes.js',
      });
    }
  });

  // Handle New Rider Onboarding
  app.put('/api/v1/rideronboarding', (req, res) => {
    const { Password } = req.body;
    const encryptedPassword = bcrypt.hashSync(Password, bcrypt.genSaltSync(10), null);
    db.User.update(
      {
        UserName: req.body.UserName,
        ZipCode: req.body.ZipCode,
        City: req.body.City,
        State: req.body.State,
        Password: encryptedPassword,
      },
      {
        where: { id: req.body.UserID },
      },
    )
      .then(() => {
        logger.info(`User Onboarded Successfully`, { calledFrom: 'be-routes.js' });
        res.status(200).send();
      })
      .catch((err) => {
        logger.error(`Rider Onboarding Error Encountered: ${err}`, {
          calledFrom: 'be-routes.js',
        });
        res.status(401).json(err);
      });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the profile page.
  // Otherwise the user will be sent an error
  app.post('/api/v1/login', passport.authenticate('local'), (req, res) => {
    res.json({
      email: req.user.Email,
      id: req.user.id,
      isAdmin: req.user.isAdmin,
      isActive: req.user.isActive,
      apiKey: serverApiKey,
    });
  });

  // Handle New Signup
  app.post('/api/v1/newuser', (req, res) => {
    const email = req.body.Email.toLowerCase();
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;

    db.User.create({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: req.body.Password,
      Address1: req.body.Address1,
      City: req.body.City,
      State: req.body.State,
      ZipCode: req.body.ZipCode,
      CellNumber: req.body.CellNumber,
      isAdmin: 0,
      isActive: 0,
    })
      .then(async () => {
        // Add passenger to Mailchimp
        try {
          const subscribeUser = await addSubscriber(email, firstName, lastName);
          if (subscribeUser) {
            console.log('==== rider subscribed to mailchimp ====');
          }
        } catch (err) {
          logger.error(`Error encountered when subscribing user to mailchimp.${err}`, {
            calledFrom: 'be-routes.js',
          });
        }
        logger.info(`New User Created Successfully`, { calledFrom: 'be-routes.js' });
        res.status(202).send();
      })
      .catch((err) => {
        logger.error(`Signup API Error Encountered${err}`, {
          calledFrom: 'be-routes.js',
        });
        res.status(401).json(err);
      });
  });

  //
  // Submission Related
  //

  // Accept the image the user uploaded, resize it and save it.
  app.post(
    '/submit-memorial',
    uploadSubmission.uploadImages,
    uploadSubmission.resizeImages,
    uploadSubmission.getResult,
    async (req, res) => {
      let GroupRiders;
      let GroupRiderArray = [];
      let RiderArray = [];
      let PillionFlagNumber = 0;
      if (req.body.hasPillion) {
        PillionFlagNumber = req.user.PillionFlagNumber.toString();
        RiderArray.push(PillionFlagNumber);
      }
      if (req.body.isGroupSubmission) {
        GroupRiders = req.body.GroupRiderInfo;
        GroupRiderArray = GroupRiders.split(',');
        RiderArray = RiderArray.concat(GroupRiderArray);
      }
      db.Submission.create({
        UserID: req.user.id,
        MemorialID: req.body.MemorialID,
        PrimaryImage: req.body.images[0],
        OptionalImage: req.body.images[1],
        RiderNotes: req.body.RiderNotes,
        OtherRiders: RiderArray.toString(),
        Source: req.body.Source,
        Status: 0, // 0 = Pending Approval
      });
      res.redirect('/memorials');
    },
  );

  // Handle Manual Entry
  app.put('/handle-alt-entry', async (req, res) => {
    const memCode = req.body.MemorialCode;
    let memID = 0;
    try {
      const memIDResponse = await q.queryMemorialIDbyMemCode(memCode);
      memID = memIDResponse[0].id;
    } catch (err) {
      logger.error(
        `Error encountered when getting memorial ID for ${memCode} via Alternate Entry Tool.`,
        { calledFrom: 'be-routes.js' },
      );
    }
    if (memID > 0) {
      db.EarnedMemorialsXref.create({
        FlagNumber: req.body.FlagNumber,
        MemorialID: memID,
        RallyYear: currentRallyYear,
      });
    }
    res.send('success');
  });

  // Update submissions
  app.put('/handle-submission', (req, res) => {
    logger.info(`handle-submission was provided: ${JSON.stringify(req.body)}`, {
      calledFrom: 'be-routes.js',
    });
    // Update the submission record to mark it as scored
    db.Submission.update(
      {
        Status: req.body.Status,
        ScorerNotes: req.body.ScorerNotes,
      },
      {
        where: { id: req.body.SubmissionID },
      },
    ).then(() => {
      logger.info(
        `Submission ${req.body.SubmissionID} updated with Status ${req.body.Status}. ScorerNotes: ${req.body.ScorerNotes}`,
        { calledFrom: 'be-routes.js' },
      );
      if (req.body.Status === '1') {
        // Grant credit to the submitter
        db.EarnedMemorialsXref.create({
          FlagNumber: req.body.SubmittedFlagNumber,
          MemorialID: req.body.SubmittedMemorialID,
          RallyYear: currentRallyYear,
        })
          .then(() => {
            logger.info(
              `Submission ${req.body.SubmissionID} granted rider ${req.body.SubmittedFlagNumber} credit for ${req.body.SubmittedMemorialID} in ${currentRallyYear}.`,
              { calledFrom: 'be-routes.js' },
            );
          })
          .catch((err) => {
            logger.error(
              `Failed to create EarnedMemorialsXref entry for Rider # ${req.body.SubmittedFlagNumber}: ${err}`,
              { calledFrom: 'be-routes.js' },
            );
            // res.status(401).json(err);
          });
        // If there are additional participants on the submission then credit them, too.
        if (req.body.SubmittedOtherRiders) {
          logger.info(
            `${req.body.SubmissionID} has multiple riders: ${req.body.SubmittedOtherRiders}`,
            {
              calledFrom: 'be-routes.js',
            },
          );
          const RiderFlagArray = req.body.SubmittedOtherRiders.split(',');
          RiderFlagArray.forEach((rider) => {
            db.EarnedMemorialsXref.create({
              FlagNumber: rider,
              MemorialID: req.body.SubmittedMemorialID,
              RallyYear: currentRallyYear,
            })
              .then(() => {
                logger.info(
                  `Submission ${req.body.SubmissionID} granted other rider ${rider} credit for ${req.body.SubmittedMemorialID} in ${currentRallyYear}.`,
                  { calledFrom: 'be-routes.js' },
                );
              })
              .catch((err) => {
                logger.error(
                  `Failed to create EarnedMemorialsXref entry for OtherRider # ${rider}: ${err}`,
                  {
                    calledFrom: 'be-routes.js',
                  },
                );
                // res.status(401).json(err);
              });
          });
        }
      }
    });
    // If it was approved, add a record to the EarnedMemorialsXref table to mark it as earned for the appropriate people.
    res.send('success');
  });

  // POTM Submission
  app.put('/handle-potmSubmission', async (req, res) => {
    const SubID = req.body.SubmissionID;

    // Send an email for POTM suggestion.
    const SubmissionLink = `${process.env.BASE_URL}/submission/${SubID}/`;
    const emailBody = await ejs.renderFile('./views/emails/emailPOTMSuggestion.ejs', {
      URL: SubmissionLink,
    });
    await sendEmail(
      'potm@tourofhonor.com',
      'Tour of Honor Scoring Team - POTM Suggestion',
      emailBody,
    );
    res.send('POTM Suggestion has been sent.');
  });

  // Delete a Submission
  app.delete('/handle-submission/:id', (req, res) => {
    const { id } = req.params;
    db.Submission.destroy({
      where: {
        id,
      },
    }).then(() => {
      res.status(202).send();
    });
  });

  //
  // Profile Related
  //

  // Handle Profile Updates
  app.put('/api/v1/user', (req, res) => {
    db.User.update(
      {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        FlagNumber: req.body.FlagNumber,
        PillionFlagNumber: req.body.PillionFlagNumber,
        Email: req.body.Email,
        Address1: req.body.Address1,
        City: req.body.City,
        State: req.body.State,
        ZipCode: req.body.ZipCode,
        TimeZone: req.body.TimeZone,
        CellNumber: req.body.CellNumber,
        isAdmin: req.body.isAdmin,
      },
      {
        where: { id: req.body.UserID },
      },
    );
    res.send('success');
  });

  // Handle Address Update
  app.put('/api/v1/saveAddress', (req, res) => {
    db.User.update(
      {
        Address1: req.body.Address1,
        City: req.body.City,
        State: req.body.State,
        ZipCode: req.body.ZipCode,
        Email: req.body.Email,
        CellNumber: req.body.CellNumber,
        TimeZone: req.body.TimeZone,
      },
      {
        where: { id: req.body.UserID },
      },
    );
    res.send('success');
  });

  // Delete a User
  app.delete('/api/v1/user/:id', (req, res) => {
    const { id } = req.params;
    db.User.destroy({
      where: {
        id,
      },
    }).then(() => {
      res.status(202).send();
    });
  });

  // Fetch a User
  app.get('/api/v1/riderInfo/:uid', async (req, res) => {
    const { uid } = req.params;
    let riderInfo;
    try {
      riderInfo = await q.queryUserInfoByID(uid);
    } catch (err) {
      logger.error(`Error encountere when fetching queryUserInfoByID(${uid}).${err}`, {
        calledFrom: 'be-routes.js',
      });
    }
    res.json(riderInfo[0]);
  });

  // Find active rider by flag number
  app.get('/api/v1/lookupActiveRiderByFlag/:flag', (req, res) => {
    const { flag } = req.params;
    db.Flag.findOne({
      where: {
        FlagNumber: flag,
        RallyYear: currentRallyYear,
      },
    }).then((dbPost) => {
      res.json(dbPost);
    });
  });

  // Find rider info by flag number for the passenger registration tool
  app.get('/api/v1/lookupPassInfoByFlag/:flag', async (req, res) => {
    const { flag } = req.params;
    // let PassengerInfo;
    db.Flag.findOne({
      where: {
        FlagNumber: flag,
        RallyYear: 2022,
      },
    }).then((flagInfo) => {
      db.User.findOne({
        where: {
          id: flagInfo.UserID,
        },
      }).then((userInfo) => {
        res.json(userInfo);
      });
    });
  });

  // Handle Trophy Awards
  app.put('/api/v1/award-trophy', async (req, res) => {
    db.Trophy.update(
      {
        FlagNumbers: req.body.FlagNumbers,
      },
      {
        where: {
          RegionID: req.body.RegionID,
          PlaceNum: req.body.TrophyPlace,
          RallyYear: currentRallyYear,
        },
      },
    );
    res.send('success');
  });

  // Handle Granting Awards
  app.put('/api/v1/award-iba', async (req, res) => {
    db.Award.create({
      FlagNumber: req.body.FlagNumber,
      Name: req.body.AwardName,
      RideDate: req.body.AwardDate,
      RallyYear: currentRallyYear,
    });
    res.send('success');
  });

  // Lookup Orders by RiderID
  app.get('/api/v1/lookupOrderByUserID/:id', (req, res) => {
    const { id } = req.params;
    db.Orders.findOne({
      where: {
        id,
      },
    }).then((dbPost) => {
      res.json(dbPost);
    });
  });

  // Handle Registration Flow
  app.post('/api/v1/regFlow', async (req, res) => {
    const { RegStep } = req.body;
    logger.debug(`regFlow called with step: ${RegStep}`);

    /* #region  RegStep Rider */
    if (RegStep === 'Rider') {
      logger.debug(`${RegStep} step entered.`);
      db.Order.create({
        UserID: req.body.UserID,
        NextStepNum: 1,
      })
        .then((o) => {
          logger.info(`Order ${o.id} created.`, { calledFrom: 'be-routes.js' });
          res.status(200).send();
        })
        .catch((err) => {
          logger.error(`Error creating order: ${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(401).json(err);
        });
    }
    /* #endregion */

    /* #region  RegStep Bike */
    if (RegStep === 'Bike') {
      logger.debug(`${RegStep} step entered.`);
      db.Order.update(
        {
          NextStepNum: 2,
        },
        {
          where: {
            RallyYear: 2023,
            UserID: req.body.UserID,
          },
        },
      )
        .then(() => {
          res.status(200).send();
        })
        .catch((err) => {
          logger.error(`Error updating order with bike info: ${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(401).json(err);
        });
    }
    /* #endregion */

    /* #region  RegStep NoPassenger */
    if (RegStep === 'NoPassenger') {
      logger.debug(`${RegStep} step entered.`);
      db.Order.update(
        {
          PassUserID: req.body.PassUserID,
          NextStepNum: 3,
        },
        {
          where: {
            RallyYear: 2023,
            UserID: req.body.UserID,
          },
        },
      )
        .then(() => {
          res.status(200).send();
        })
        .catch((err) => {
          logger.error(`Error updating order with no passenger info: ${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(401).json(err);
        });
    }
    /* #endregion */

    /* #region  RegStep ExistingPassenger */
    if (RegStep === 'ExistingPassenger') {
      // let hasPassenger;
      logger.debug(`${RegStep} step entered.`);
      db.Order.update(
        {
          PassUserID: req.body.PassUserID,
          NextStepNum: 3,
        },
        {
          where: {
            RallyYear: 2023,
            UserID: req.body.UserID,
          },
        },
      )
        .then(() => {
          // hasPassenger = true;
          res.status(200).send();
        })
        .catch((err) => {
          logger.error(`Error updating order with passenger info: ${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(401).json(err);
        });
    }
    /* #endregion */

    /* #region  RegStep NewPassenger */
    if (RegStep === 'NewPassenger') {
      logger.debug(`${RegStep} step entered.`);

      // Check to see if Email is unique
      db.User.findOne({
        where: {
          Email: req.body.Email,
        },
      }).then((emailCheck) => {
        if (emailCheck) {
          // Reject the submission
          return res.status(409).send();
        }
        // Create New User and Update the Order
        db.User.create({
          FirstName: req.body.FirstName,
          LastName: req.body.LastName,
          FlagNumber: req.body.FlagNumber,
          Email: req.body.Email.toLowerCase(),
          Password: req.body.Password,
        }).then((newUser) => {
          if (newUser) {
            // Update the Order
            db.Order.update(
              {
                PassUserID: newUser.id,
                NextStepNum: 3,
              },
              {
                where: {
                  RallyYear: 2023,
                  UserID: req.body.UserID,
                },
              },
            ).then(async () => {
              // Add passenger to Mailchimp
              try {
                const subscribeUser = await addSubscriber(
                  req.body.Email.toLowerCase(),
                  req.body.FirstName,
                  req.body.LastName,
                );
                if (subscribeUser) {
                  console.log('==== passenger subscribed to mailchimp ====');
                }
              } catch (err) {
                logger.error(`Error encountered: queryNextPendingSubmissions.${err}`, {
                  calledFrom: 'be-routes.js',
                });
              }
              res.status(200).send();
            });
          }
        });
      });
    }
    /* #endregion */

    /* #region  RegStep Charity */
    if (RegStep === 'Charity') {
      logger.debug(`${RegStep} step entered.`);
      db.Order.update(
        {
          CharityChosen: req.body.CharityChoice,
          NextStepNum: 4,
        },
        {
          where: {
            RallyYear: 2023,
            UserID: req.body.UserID,
          },
        },
      )
        .then(() => {
          db.Order.findOne({
            where: {
              RallyYear: 2023,
              UserID: req.body.UserID,
            },
          }).then((dbOrder) => {
            let hasPassenger = false;
            if (dbOrder.PassUserID && dbOrder.PassUserID > 0) {
              hasPassenger = true;
            }
            res.status(202).send({ hasPassenger });
          });
        })
        .catch((err) => {
          logger.error(`Error updating order with charity info: ${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(401).json(err);
        });
    }
    /* #endregion */

    /* #region  RegStep Shirts */
    if (RegStep === 'Shirts') {
      logger.debug(`${RegStep} step entered.`);
      logger.debug(`Shirt info provided:${req.body}`);
      const BaseRiderRateObject = await q.queryBaseRiderRate();
      const BaseRiderRate = parseInt(BaseRiderRateObject[0].Price, 10);
      const PassengerSurchargeObject = await q.queryPassengerSurcharge();
      const PassengerSurcharge = parseInt(PassengerSurchargeObject[0].iValue, 10);
      const ShirtSizeSurchargeObject = await q.queryShirtSizeSurcharge();
      const ShirtSizeSurcharge = parseInt(ShirtSizeSurchargeObject[0].iValue, 10);
      const ShirtStyleSurchargeObject = await q.queryShirtStyleSurcharge();
      const ShirtStyleSurcharge = parseInt(ShirtStyleSurchargeObject[0].iValue, 10);
      let totalPrice = BaseRiderRate;
      const { ShirtSize } = req.body;
      const { ShirtStyle } = req.body;
      const { PassShirtSize } = req.body;
      const { PassShirtStyle } = req.body;
      const ShirtSizesToSurcharge = ['2X', '3X', '4X', '5X'];
      const ShirtStylesToSurcharge = ['Long-Sleeved', 'Ladies V-Neck'];

      const ShirtDetails = {
        ShirtSize,
        ShirtStyle,
        NextStepNum: 5,
      };

      logger.debug(`Subtotal = $${totalPrice}`);

      if (ShirtStylesToSurcharge.includes(ShirtStyle)) {
        logger.debug(`Adding Rider Style Surcharge`);
        totalPrice += ShirtStyleSurcharge;
        logger.debug(`Subtotal = $${totalPrice}`);
      }

      if (ShirtSizesToSurcharge.includes(ShirtSize)) {
        totalPrice += ShirtSizeSurcharge;
      }

      if (req.body.hasPass === 'true') {
        totalPrice += PassengerSurcharge;
        ShirtDetails.PassShirtSize = PassShirtSize;
        ShirtDetails.PassShirtStyle = PassShirtStyle;
        if (ShirtStylesToSurcharge.includes(PassShirtStyle)) {
          totalPrice += ShirtStyleSurcharge;
        }
        if (ShirtSizesToSurcharge.includes(PassShirtSize)) {
          totalPrice += ShirtSizeSurcharge;
        }
      }

      const PriceTierObject = await q.queryTierByPrice(totalPrice);
      const PriceTier = parseInt(PriceTierObject[0].Tier, 10);
      const { ShopifyVariantID } = PriceTierObject[0];
      ShirtDetails.PriceTier = PriceTier;

      // Generate the Shopify URL & ID
      const checkoutDetails = await generateShopifyCheckout(ShopifyVariantID);
      const { CheckoutURL } = checkoutDetails;
      ShirtDetails.CheckoutURL = CheckoutURL;
      logger.info(`Checkout URL Generated: ${CheckoutURL}`, {
        calledFrom: 'be-routes.js',
      });
      ShirtDetails.CheckoutID = checkoutDetails.CheckoutID;
      logger.info(`Checkout ID Generated: ${ShirtDetails.CheckoutID}`, {
        calledFrom: 'be-routes.js',
      });

      // Update Order with the shirt details
      db.Order.update(ShirtDetails, {
        where: {
          RallyYear: 2023,
          UserID: req.body.UserID,
        },
      })
        .then(() => {
          res.status(202).send({ CheckoutURL, PriceTier, ShopifyVariantID, totalPrice });
        })
        .catch((err) => {
          logger.error(`Error updating order with t-shirt info: ${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(401).json(err);
        });
    }
    /* #endregion */

    /* #region  RegStep Payment */
    if (RegStep === 'Payment') {
      logger.debug(`${RegStep} step entered.`);
      res.send('success');
    }
    /* #endregion */

    /* #region  RegStep Waiver */
    if (RegStep === 'Waiver') {
      logger.debug(`${RegStep} step entered.`);

      const WaiverInfo = {
        NextStepNum: 7,
      };

      // Update Order with new step number
      db.Order.update(WaiverInfo, {
        where: {
          RallyYear: currentRallyYear,
          id: req.body.OrderID,
        },
      })
        .then(() => {
          res.status(202).send();
        })
        .catch((err) => {
          logger.error(`Error updating order with Waiver info: ${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(401).json(err);
        });
    }
    /* #endregion */

    /* #region  RegStep FlagInProgress */
    if (RegStep === 'FlagInProgress') {
      logger.info(`${RegStep} step entered.`);
      let ApplyFlagSurcharge = req.body.FlagSurcharge;
      const { RequestedFlagNumber } = req.body;
      const FlagInfo = {
        FlagNumber: RequestedFlagNumber,
        UserID: req.body.UserID,
        RallyYear: req.body.RallyYear,
      };
      const UserInfo = {
        isActive: 1,
      };
      if (RequestedFlagNumber >= 1201 && RequestedFlagNumber <= 2500) {
        // eslint-disable-next-line no-plusplus
        ApplyFlagSurcharge++;
      }
      const OrderInfo = {
        applyFlagSurcharge: ApplyFlagSurcharge,
      };
      if (req.body.whoami === 'rider') {
        OrderInfo.RequestedRiderFlagNumber = req.body.RequestedFlagNumber;
      }
      if (req.body.whoami === 'passenger') {
        OrderInfo.RequestedPassFlagNumber = req.body.RequestedFlagNumber;
      }

      if (ApplyFlagSurcharge > 0 && ApplyFlagSurcharge <= 2) {
        const flagSurchargeAmt = ApplyFlagSurcharge === 2 ? 60 : 30;
        const PriceTierObject = await q.queryTierByPrice(flagSurchargeAmt);
        const { ShopifyVariantID } = PriceTierObject[0];

        // Generate the Shopify URL & ID for the Flag Surcharge
        const checkoutDetails = await generateShopifyCheckout(ShopifyVariantID);
        const { CheckoutURL } = checkoutDetails;
        OrderInfo.FlagSurchargeCheckoutURL = CheckoutURL;
        logger.info(`Flag Surcharge Checkout URL Generated: ${CheckoutURL}`, {
          calledFrom: 'be-routes.js',
        });
        const { CheckoutID } = checkoutDetails;
        OrderInfo.FlagSurchargeCheckoutID = CheckoutID;
        logger.info(`Flag Surcharge Checkout ID Generated: ${CheckoutID}`, {
          calledFrom: 'be-routes.js',
        });
      }

      // Update the DB tables
      // Assign the Flag number to the rider
      db.Flag.create(FlagInfo)
        .then(() => {
          logger.info(
            `Flag number ${req.body.RequestedFlagNumber} assigned to UserID ${req.body.UserID}`,
            {
              calledFrom: 'be-routes.js',
            },
          );
          // Update User to be Active
          db.User.update(UserInfo, {
            where: {
              id: req.body.UserID,
            },
          })
            .then(() => {
              logger.info(`User ${req.body.UserID} was marked active.`, {
                calledFrom: 'be-routes.js',
              });
              // Update Order with Flag info
              db.Order.update(OrderInfo, {
                where: {
                  RallyYear: req.body.RallyYear,
                  id: req.body.OrderID,
                },
              })
                .then(() => {
                  logger.info(`Order ${req.body.OrderID} was updated with FlagInfo.`, {
                    calledFrom: 'be-routes.js',
                  });
                  res.status(202).send();
                })
                .catch((err) => {
                  logger.error(`Error updating order with FlagInProgress info: ${err}`, {
                    calledFrom: 'be-routes.js',
                  });
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              logger.error(`Error marking User ${req.body.UserID} active: ${err}`, {
                calledFrom: 'be-routes.js',
              });
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          logger.error(`Error when saving flag number assignments:${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(400).json(err);
        });
    }
    /* #endregion */

    /* #region  RegStep FlagComplete */
    if (RegStep === 'FlagComplete') {
      logger.debug(`${RegStep} step entered.`);

      const FlagInfoComplete = {
        NextStepNum: 8,
      };

      db.Order.update(FlagInfoComplete, {
        where: {
          RallyYear: currentRallyYear,
          id: req.body.OrderID,
        },
      })
        .then(() => {
          db.Order.findOne({
            where: {
              id: req.body.OrderID,
            },
          }).then((result) => {
            if (result.RequestedPassFlagNumber && result.RequestedPassFlagNumber > 0) {
              db.Passenger.create({
                RiderFlagNumber: result.RequestedRiderFlagNumber,
                PassengerFlagNumber: result.RequestedPassFlagNumber,
                RallyYear: currentRallyYear,
              }).catch((err) => {
                logger.error(`Error saving Passenger Info for Order ${req.body.OrderID}: ${err}`, {
                  calledFrom: 'be-routes.js',
                });
              });
            }
          });
        })
        .then(() => {
          res.status(202).send();
        })
        .catch((err) => {
          logger.error(`Error updating order ${req.body.OrderID} with FlagComplete info: ${err}`, {
            calledFrom: 'be-routes.js',
          });
          res.status(401).json(err);
        });
    }
    /* #endregion */
  });

  // Check Order Status for a given Rider
  app.get('/api/v1/checkOrderStatus/:id', async (req, res) => {
    const { id } = req.params;
    db.Order.findOne({
      where: {
        UserID: id,
        RallyYear: 2023,
      },
    }).then(async (o) => {
      if (o.OrderNumber === null) {
        logger.info(`OrderNumber not found locally, checking Shopify...`, {
          calledFrom: 'be-routes.js',
        });
        // Check Shopify for an Order Number
        let orderNumber;
        try {
          orderNumber = await checkOrderStatusByCheckoutID(o.CheckoutID);
        } catch (err) {
          logger.warn(
            `orderNumber not found for TOH Order ${o.id}. Order is likely not paid for yet.${err}`,
          );
          res.json(0);
        }
        // If Shopify provides us with an Order number, then add it to the DB.
        if (orderNumber) {
          db.Order.update(
            {
              OrderNumber: orderNumber,
              NextStepNum: 6,
            },
            {
              where: {
                RallyYear: 2023,
                UserID: id,
              },
            },
          ).then(() => {
            logger.info(`Shopify Order Number updated for rider ${id}`, {
              calledFrom: 'be-routes.js',
            });
            res.json(orderNumber);
          });
        }
      }
      if (o.OrderNumber) {
        logger.info(`Shopify Order Number found locally: ${o.OrderNumber}`, {
          calledFrom: 'be-routes.js',
        });
        res.json(o.OrderNumber);
      }
    });
  });

  // Add New User Group
  app.post('/api/v1/group', (req, res) => {
    db.UserGroup.create({
      Name: req.body.GroupName,
      Description: req.body.GroupDescription,
      IsAdmin: req.body.GroupIsAdmin,
      IsActive: req.body.GroupIsActive,
      IsProtected: 0,
    })
      .then((g) => {
        logger.info(`Group ${g.id} created.`, { calledFrom: 'be-routes.js' });
        res.status(200).send();
      })
      .catch((err) => {
        logger.error(`Error creating Group: ${err}`, { calledFrom: 'be-routes.js' });
        res.status(401).json(err);
      });
  });

  // Update a User Group
  app.put('/api/v1/group/:id', (req, res) => {
    const groupid = req.params.id;

    db.UserGroup.update(
      {
        Name: req.body.GroupName,
        Description: req.body.GroupDescription,
        IsAdmin: req.body.GroupIsAdmin,
        IsActive: req.body.GroupIsActive,
      },
      {
        where: {
          id: groupid,
        },
      },
    )
      .then(() => {
        logger.info(`Group ${groupid} updated.`, { calledFrom: 'be-routes.js' });
        res.status(200).send();
      })
      .catch((err) => {
        logger.error(`Error creating Group: ${err}`, { calledFrom: 'be-routes.js' });
        res.status(401).json(err);
      });
  });

  app.post('/api/v1/waiver', async (req, res) => {
    const waiverID = req.body.unique_id;
    const smartWaiverURL = `https://api.smartwaiver.com/v4/waivers/${waiverID}`;
    const smartWaiverAPIKey = process.env.SMARTWAIVER_API_KEY;

    let RiderID = 0;

    logger.info(`Waiver Webhook Response: ${req.body}`, { calledFrom: 'be-routes.js' });

    fetch(smartWaiverURL, {
      method: 'get',
      headers: { 'sw-api-key': smartWaiverAPIKey },
    })
      .then((res2) => res2.json())
      .then((json) => {
        try {
          RiderID = json.waiver.autoTag || 0;
          updateWaiverTable(RiderID);
        } catch (err) {
          logger.error(
            `No user found when fetching from SmartWaiver. Response was: ${json} | ${err}`,
            {
              calledFrom: 'be-routes.js',
            },
          );
        }
      });

    async function updateWaiverTable(rider) {
      if (rider > 0) {
        await db.Waiver.findOrCreate({
          where: {
            UserID: rider,
            RallyYear: currentRallyYear,
          },
          defaults: {
            UserID: rider,
            WaiverID: waiverID,
            RallyYear: currentRallyYear,
          },
        });
        res.status(200).send();
      } else {
        logger.error(`UserID ${rider} was not found in SmartWaiver response.`, {
          calledFrom: 'be-routes.js',
        });
      }
    }

    res.status(404).send();
  });

  // Check Waiver Status
  app.get('/api/v1/checkWaiverStatus/:id', (req, res) => {
    const waiverID = req.params.id;
    db.Waiver.findOne({
      where: {
        UserID: waiverID,
        RallyYear: currentRallyYear,
      },
    }).then((waiverData) => {
      res.json(waiverData);
    });
  });

  // Send SMS Message
  app.post('/api/v1/sendSMS', (req, res) => {
    const { destNumber } = req.body;
    const messageText = req.body.Message;

    try {
      twilio.sendSMSMessage(destNumber, messageText);
    } catch (err) {
      logger.error('Error in twilio.sendSMSMessage API call.', {
        calledFrom: 'be-routes.js',
      });
    }

    res.status(200).send();
  });
};
