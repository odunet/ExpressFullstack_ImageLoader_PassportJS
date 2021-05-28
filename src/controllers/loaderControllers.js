const { findData, createData } = require('../models/loader/loaderMethod');
const jwt = require('jsonwebtoken');
const { sign } = require('../services/jwtService');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
require('dotenv').config();

// @route   GET loader/ [Not Implemented]
// @desc    Get all or slected data based on query keys
// @access  Public
const checkData = (user) => async (req, res, next) => {
  try {
    if (`${JSON.stringify(req.query)}` === '{}') {
      let response = await user
        .find()
        .select(['-passwordHash', '-binaryImageSrc', '-base64ImageSrc']);
      return res.status(200).json({
        message: `All data retrieved`,
        data: response,
      });
    } else {
      //Using custom `findData` function
      let response = await findData(user, req.query);
      return res.status(200).json({
        message: `Data with parameters: ${JSON.stringify(req.query)} retrieved`,
        data: response,
      });
    }
  } catch (e) {
    return res.status(404).json({
      message: `Error: Data with parameters: ${JSON.stringify(
        req.query
      )} not retrieved`,
      'Error details': e,
    });
  }
};

// @route   POST api/register
// @desc    Create new data
// @access  Public
const createNewData = (user) => async (req, res, next) => {
  const errors = validationResult(req);
  // Evaluate if there are errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Get lenght of collection
    let temp = await findData(user);
    req.body['id'] = temp.length + 1;

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);
    req.body.passwordHash = hash;
    req.body.base64ImageSrc = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString('base64')}`;
    req.body.binaryImageSrc = req.file.buffer;

    //Check if user is admin
    if (req.body.isAdmin) {
      req.body.isAdmin = true;
    } else {
      req.body.isAdmin = false;
    }

    let response = await createData(user, req.body);
    // Redirect to index page
    return res
      .status(200)
      .redirect('/loader/index?dataIn=' + req.body.userName);
  } catch (e) {
    req.errors = err.message;
    console.log(`Error is controller: ${req.errors}`);
    next(err);
  }
};

// @route   POST loader/auth/logintest
// @desc    Auth user(student, tutor, admin) receives authenticate passport user and redirect to auth page
// @access  Public
const login = (User) => async (req, res, next) => {
  let payload;
  //Populate payload and generate token, then redirect to user page
  if (!req.user.googleId) {
    payload = {
      user: {
        id: req.user._id,
        isAdmin: req.user.isAdmin,
      },
    };
  } else {
    payload = {
      user: {
        googleId: req.user.googleId,
        email: req.user.email,
      },
    };
  }

  // let token = await sign(payload, process.env.SECRET, {
  //   expiresIn: 36000,
  // });

  // req.session.token = token;

  // //Redirect to auth page
  // return res.status(200).redirect('/loader/auth/user');

  jwt.sign(
    payload,
    process.env.SECRET,
    {
      expiresIn: 36000,
    },
    (err, token) => {
      if (err) throw err;

      req.session.token = token;
      //Redirect to auth page
      return res.status(200).redirect('/loader/auth/user');
    }
  );
};

// @route   GET loader/auth/logout
// @desc    Auth user(student, tutor, admin) and get token
// @access  Public
const logoutUser = (User) => async (req, res, next) => {
  // Get user from DB
  try {
    const user = await User.findById(req.user.id)
      .select('-passwordHash')
      .select('-binaryImageSrc');
    if (req.cookies['x-auth-token']) {
      res.cookie('x-auth-token', 'Expired', {
        expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
    } else {
      req.session.token = null;
    }
    //Redirect to auth page
    req.flash('logoutMsg', `${user.userName}`);
    return res.status(200).redirect('/loader/index');
    // res.status(200).redirect('/loader/index?dataOut=' + user.userName);
  } catch (err) {
    req.errors = err.message;
    console.log(`Error is controller: ${req.errors}`);
    next(err);
  }
};

// @route   GET api/auth/
// @desc    Auth user(student, tutor, admin)
// @access  Public
const getLoggedInUser = (User) => async (req, res, next) => {
  try {
    // Get user from DB
    const user = await User.findById(req.user.id)
      .select('-passwordHash')
      .select('-binaryImageSrc');

    if (req.user.isAdmin == true) {
      return res.status(200).render('admin', {
        title: user.userName,
        time: user.createdAt,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.base64ImageSrc,
      });
    } else {
      return res.status(200).render('user', {
        title: user.userName,
        time: user.createdAt,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.base64ImageSrc,
      });
    }
  } catch (error) {
    req.errors = error.message;
    console.log(`Error is controller: ${req.errors}`);
    next(error);
  }
};

// @route   POST api/adminAuth/deleteUser
// @desc    Auth user(student, tutor, admin)
// @access  Public
const deleteUser = (User) => async (req, res, next) => {
  try {
    // Get user from DB
    const user = await User.deleteOne({ userName: req.body.userName });
    return res.status(200).json({
      statusCode: 200,
      message: `User ${req.body.userName} deleted`,
    });
  } catch (error) {
    req.errors = err.message;
    console.log(`Error is controller: ${req.errors}`);
    next(err);
  }
};

// @route   GET loader/register
// @desc    Serves static register page
// @access  Public
const registerStatic = (req, res, next) => {
  return res.render('register', { title: 'Register' });
};

// @route   GET loader/login
// @desc    Serves static login page
// @access  Public
const loginStatic = (req, res) => {
  if (res.locals.error.length != 0) {
    let passportError = res.locals.error;
    return res.render('login', {
      title: 'Login',
      passportError: passportError,
    });
  }
  return res.render('login', { title: 'Login' });
};

// @route   GET loader/index
// @desc    Serves static landing page
// @access  Public
const indexStatic = (req, res, next) => {
  if (res.locals.logoutMsg.length != 0) {
    let message = `User ${res.locals.logoutMsg} has been Loged Out`;
    return res.render('index', { title: 'Home', message: message });
  }

  //Else
  let message = '';
  if (req.header('Referer') && (req.query.dataIn || req.query.dataOut)) {
    message = req.query.dataIn
      ? `User: ${req.query.dataIn} has been registered`
      : `User: ${req.query.dataOut} has been Loged Out`;
  }
  return res.render('index', {
    title: 'Home',
    message: message,
  });
};

module.exports = {
  indexStatic,
  loginStatic,
  checkData,
  createNewData,
  login,
  getLoggedInUser,
  registerStatic,
  logoutUser,
  deleteUser,
};
