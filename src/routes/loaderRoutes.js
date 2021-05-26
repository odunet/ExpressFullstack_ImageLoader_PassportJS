const express = require('express');
const router = express.Router();
const loaderControllers = require('../controllers/loaderControllers');
const { check } = require('express-validator');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

//import passport
const passport = require('passport');

//Set storage in buffer
const upload = multer({ storage: multer.memoryStorage() });

// Require middleware
const authGeneral = require('../middleware/loaderRoute/authGeneral');
const adminAuth = require('../middleware/loaderRoute/authAdmin');
const formValidator = require('../middleware/loaderRoute/formValidator');

//Create schema
const loader = require('../models/loader');

/*
 * ROUTES
 */
// @route   GET loader/index
// @desc    Serves static landing page
// @access  Public
router.get('/index', loaderControllers.indexStatic);

// @route   GET loader/login
// @desc    Serves static login page
// @access  Public
router.get('/login', loaderControllers.loginStatic);

// @route   GET loader/auth/user
// @desc    Serves static user profile page
// @access  Public
router.get(
  '/auth/user',
  authGeneral,
  loaderControllers.getLoggedInUser(loader)
);

// @route   GET loader/register
// @desc    Serves static register page
// @access  Public
router.get('/register', loaderControllers.registerStatic);

// @route   POST loader/auth/deleteuser
// @desc    Delete a user who's userName is passed
// @access  Public
router.post(
  '/auth/deleteUser',
  [check('userName', 'Username not valid').exists()],
  adminAuth,
  loaderControllers.deleteUser(loader)
);

// @route   POST loader/auth/userList
// @desc    Serves static list of users
// @access  Public
router.get('/auth/userList', adminAuth, loaderControllers.checkData(loader));

// // @route   POST loader/auth/register
// // @desc    Register user(user, admin) and redirect to homepage
// // @access  Public
router.post(
  '/auth/register',
  upload.single('photo'),
  [
    check('userName', 'Please enter a valid username').exists(),
    check('password', 'A valid password is required').exists(),
  ],
  loaderControllers.createNewData(loader)
);

// @route   POST loader/auth/logintest
// @desc    Register user(user, admin) and redirect to homepage
// @access  Public
router.post(
  '/login',
  [
    check('userName', 'Please enter a valid username')
      .exists()
      .isLength({ min: 1 })
      .withMessage('Must be at least 1 chars long'),
    check('password', 'A valid password is required')
      .exists()
      .isLength({ min: 1 })
      .withMessage('Must be at least 1 chars long'),
  ],
  formValidator,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: 'login',
    session: false,
  }),
  loaderControllers.login()
);

// @route   POST loader/auth/logout
// @desc    Register user(user, admin) and redirect to homepage
// @access  Public
router.get('/auth/logout', authGeneral, loaderControllers.logoutUser(loader));

module.exports = router;
