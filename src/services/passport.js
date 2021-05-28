const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bc = require('../utils/bcryptFunctions').validPassword;
const verifyCallback = require('../utils/verifyFunction');
require('dotenv').config;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

//Create schema
const loader = require('../models/loader');

//custom fields
const customFields = {
  usernameField: 'email',
  passwordField: 'password',
};

const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((userId, done) => {
//   loader
//     .findById(userId)
//     .then((user) => {
//       done(null, user);
//     })
//     .catch((err) => done(err));
// });

/**
 * Google OAUTH2
 */
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const oauthmodel = require('../models/oauth');

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/loader/auth/google/callback',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        image: profile.photos[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
      };

      try {
        let user = await oauthmodel.findOne({ googleId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = await oauthmodel.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   oauthmodel
//     .findById(userId)
//     .then((user) => {
//       done(null, user);
//     })
//     .catch((err) => done(err));
// });
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
