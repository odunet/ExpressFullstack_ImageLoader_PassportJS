const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bc = require('../utils/bcryptFunctions').validPassword;
const verifyCallback = require('../utils/verifyFunction');

//Create schema
const loader = require('../models/loader');

//custom fields
const customFields = {
  usernameField: 'userName',
  passwordField: 'password',
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  loader
    .findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
