const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  // Evaluate if there are errors
  if (!errors.isEmpty()) {
    return res.status(200).render('login.hbs', { errors: errors.array() });
  }

  next();
};
