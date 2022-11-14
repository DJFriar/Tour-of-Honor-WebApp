/* eslint-disable no-console */
require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../models');
const q = require('../private/queries');

// Telling passport we want to use a Local Strategy. In other words, we want to login with a username/email and password
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Email',
      passwordField: 'Password',
    },
    (email, password, done) => {
      // When a user tries to sign in this code runs
      db.User.findOne({
        where: {
          Email: email,
        },
      }).then(async (dbUser) => {
        // If there's no user with the given email
        if (!dbUser) {
          return done(null, false);
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        if (!dbUser.validPassword(password)) {
          return done(null, false);
        }
        // If none of the above are triggered, get modified User object
        const userInfo = await q.queryUserInfo(email);
        // return the userInfo
        if (process.env.NODE_ENV === 'Development') {
          console.log('==== User Info ====');
          console.log(userInfo);
        }
        return done(null, userInfo);
      });
    },
  ),
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
