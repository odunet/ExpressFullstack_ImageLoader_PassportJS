//Create schema
const loader = require('../models/loader');

//bring in decryptFunc
const bc = require('./bcryptFunctions').validPassword;

//Call back required in strategy
const verifiedCallback = (username, password, done) => {
  loader
    .findOne({ userName: username })
    .then((user) => {
      if (!user) done(null, false, { message: 'Incorrect username.' });
      // PASSWORD CHECK
      bc(password, user.passwordHash)
        .then((isValid) => {
          if (isValid) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
        })
        .catch((err) => done(err));
    })
    .catch((err) => {
      done(err);
    });
};

module.exports = verifiedCallback;
