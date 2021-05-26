// Checks to see if there is a token in the header
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  //Send in cookie
  const token =
    (await req.cookies['x-auth-token']) ||
    req.header('x-auth-token') ||
    (await req.session.token);

  // check if token does not exist
  if (!token)
    return res
      .status(401)
      .json({ statusCode: 401, message: 'No token, authorization denied' });

  // else
  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    // assign user to request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ statusCode: 401, message: 'Token is not valid' });
  }
};
