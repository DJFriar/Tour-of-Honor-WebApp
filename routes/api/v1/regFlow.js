/* eslint-disable consistent-return */
/**
 * routes/api/regFlow.js
 *
 * @description:: Handler file for API calls related to rider registration. All routes with "/api/v1/regFlow" come through here.
 *
 */

const ApiRegFlowRouter = require('express').Router();
// const { QueryTypes } = require('sequelize');

const { logger } = require('../../../controllers/logger');
const db = require('../../../models');
// const { sequelize } = require('../../../models');
const q = require('../../../private/queries');
const {
  generateShopifyCheckout,
  // checkOrderStatusByCheckoutID,
} = require('../../../controllers/shopify');
const { addSubscriber } = require('../../../controllers/mailchimp');

const currentRallyYear = process.env.CURRENT_RALLY_YEAR;

ApiRegFlowRouter.route('/').post(async (req, res) => {
  const { RegStep } = req.body;
  logger.debug(`regFlow called with step: ${RegStep}`);

  /* #region  RegStep Rider (0) */
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

  /* #region  RegStep Bike (1) */
  if (RegStep === 'Bike') {
    logger.debug(`${RegStep} step entered.`);
    db.Order.update(
      {
        NextStepNum: 2,
      },
      {
        where: {
          RallyYear: 2024,
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

  /* #region  RegStep NoPassenger (2) */
  if (RegStep === 'NoPassenger') {
    logger.debug(`${RegStep} step entered.`);
    db.Order.update(
      {
        PassUserID: req.body.PassUserID,
        NextStepNum: 3,
      },
      {
        where: {
          RallyYear: 2024,
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

  /* #region  RegStep ExistingPassenger (2) */
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
          RallyYear: 2024,
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

  /* #region  RegStep NewPassenger (2) */
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
                RallyYear: 2024,
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

  /* #region  RegStep Charity (3) */
  if (RegStep === 'Charity') {
    logger.debug(`${RegStep} step entered.`);
    db.Order.update(
      {
        CharityChosen: req.body.CharityChoice,
        NextStepNum: 4,
      },
      {
        where: {
          RallyYear: 2024,
          UserID: req.body.UserID,
        },
      },
    )
      .then(() => {
        db.Order.findOne({
          where: {
            RallyYear: 2024,
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

  /* #region  RegStep Shirts (X) */
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
        RallyYear: 2024,
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

  /* #region  RegStep Waiver (4) */
  if (RegStep === 'Waiver') {
    logger.debug(`${RegStep} step entered.`);

    const BaseRiderRateObject = await q.queryBaseRiderRate();
    const BaseRiderRate = parseInt(BaseRiderRateObject[0].Price, 10);
    const PassengerSurchargeObject = await q.queryPassengerSurcharge();
    const PassengerSurcharge = parseInt(PassengerSurchargeObject[0].iValue, 10);
    let totalPrice;

    if (req.body.hasPass === 'true') {
      totalPrice = BaseRiderRate + PassengerSurcharge;
    } else {
      totalPrice = BaseRiderRate;
    }

    const WaiverInfo = {
      NextStepNum: 5,
    };

    const PriceTierObject = await q.queryTierByPrice(totalPrice);
    const PriceTier = parseInt(PriceTierObject[0].Tier, 10);
    const { ShopifyVariantID } = PriceTierObject[0];
    WaiverInfo.PriceTier = PriceTier;

    // Generate the Shopify URL & ID
    const checkoutDetails = await generateShopifyCheckout(ShopifyVariantID);
    const { CheckoutURL } = checkoutDetails;
    WaiverInfo.CheckoutURL = CheckoutURL;
    logger.info(`Checkout URL Generated: ${CheckoutURL}`, {
      calledFrom: 'be-routes.js',
    });
    WaiverInfo.CheckoutID = checkoutDetails.CheckoutID;
    logger.info(`Checkout ID Generated: ${WaiverInfo.CheckoutID}`, {
      calledFrom: 'be-routes.js',
    });

    // Update Order with WaiverInfo
    db.Order.update(WaiverInfo, {
      where: {
        RallyYear: currentRallyYear,
        id: req.body.OrderID,
      },
    })
      .then(() => {
        res.status(202).send({ CheckoutURL, PriceTier, ShopifyVariantID, totalPrice });
      })
      .catch((err) => {
        logger.error(`Error updating order with Waiver info: ${err}`, {
          calledFrom: 'be-routes.js',
        });
        res.status(401).json(err);
      });
  }
  /* #endregion */

  /* #region  RegStep Payment (5) */
  if (RegStep === 'Payment') {
    logger.debug(`${RegStep} step entered.`);
    res.send('success');
  }
  /* #endregion */

  /* #region  RegStep FlagInProgress (6) */
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
      const flagSurchargeAmt = ApplyFlagSurcharge === 2 ? 50 : 25;
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

  /* #region  RegStep FlagComplete (6) */
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

module.exports = ApiRegFlowRouter;
