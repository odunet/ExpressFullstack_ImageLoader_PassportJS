// Checks to see if there is a token in the header
const jwt = require('jsonwebtoken');
require('dotenv').config();
const loader = require('../../models/loader');

module.exports = async (req, res, next) => {
  //Send in cookie
  const token =
    req.cookies['x-auth-token'] ||
    req.header('x-auth-token') ||
    req.session.token;

  // check if token does not exist
  if (!token)
    return res
      .status(401)
      .json({ statusCode: 401, message: 'No token, authorization denied' });

  // else
  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    // Check if user is not Admin
    if (decoded.user.isAdmin === false)
      return res.status(401).json({
        statusCode: 401,
        message: 'Usr not admin, authorization denied',
      });

    // assign user to request object
    req.user = decoded.user;

    //Check if login was by google
    if (req.user.googleId) {
      let userEmail = await loader.findOne({ email: req.user.email });
      if (userEmail.length == 0)
        return res.status(200).json({ message: 'User not registered' });

      //if google user is registered
      req.user.id = userEmail._id;
    }

    next();
  } catch (err) {
    res.status(401).json({ statusCode: 401, message: 'Token is not valid' });
  }
};
