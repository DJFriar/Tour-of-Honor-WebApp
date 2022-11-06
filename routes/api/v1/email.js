/**
 * routes/api/email.js
 *
 * @description:: Handler file for API calls related to emails. All routes with "/api/v1/email" come through here.
 *
 */

const ApiEmailRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ejs = require('ejs');

const db = require('../../../models');
const { logger } = require('../../../controllers/logger');
const sendEmail = require('../../../private/sendEmail');

ApiEmailRouter.route('/:email').get((req, res) => {
  const { email } = req.params;
  db.User.findOne({
    where: {
      Email: email,
    },
  }).then((dbPost) => {
    res.json(dbPost);
  });
});

ApiEmailRouter.route('/potmSubmission').put(async (req, res) => {
  const SubID = req.body.SubmissionID;
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

// eslint-disable-next-line consistent-return
ApiEmailRouter.route('/resetpasswordrequest').post(async (req, res) => {
  try {
    // Look for the user in the DB
    const User = await db.User.findOne({
      where: {
        Email: req.body.Email,
      },
    });
    // Error if the user isn't found.
    if (!User) {
      return res.status(400).send('User email not found.');
    }
    // See if a token already exists for the user.
    let ResetToken = await db.ResetToken.findOne({
      where: {
        user_id: User.id,
      },
    });
    // If not, create a new token.
    if (!ResetToken) {
      await db.ResetToken.create({
        user_id: User.id,
        Token: crypto.randomBytes(32).toString('hex'),
      })
        .then((data) => {
          ResetToken = data;
        })
        .catch((err) => {
          logger.error('Error creating token');
          res.status(401).json(err);
        });
    }
    // Send the password reset email.
    const PWResetLink = `${process.env.BASE_URL}/forgotpassword/${User.id}/${ResetToken.Token}`;
    const emailBody = await ejs.renderFile('./views/emails/emailPasswordReset.ejs', {
      URL: PWResetLink,
    });
    await sendEmail(
      User.Email,
      'Tour of Honor Scoring Portal - Password Reset Request',
      emailBody,
    ).then(() => {
      res.status(200).send();
    });
  } catch (err) {
    logger.error(err);
    res.status(401).json(err);
  }
});

ApiEmailRouter.route('/resetpasswordaction').put((req, res) => {
  const { Password } = req.body;
  const encryptedPassword = bcrypt.hashSync(Password, bcrypt.genSaltSync(10), null);
  // Update user's password
  db.User.update(
    {
      Password: encryptedPassword,
    },
    {
      where: { id: req.body.UserID },
    },
  );
  // Remove the token that was created.
  db.ResetToken.destroy({
    where: { user_id: req.body.UserID },
  });
  res.send('success');
});

module.exports = ApiEmailRouter;
