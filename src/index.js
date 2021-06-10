//Common JS import
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const morgan = require('morgan');
const mongoose = require('mongoose');

//The direct use of ES6 methods are possible with the dependency 'ESM'
import exphbs from 'express-handlebars';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';

//Get env variable
require('dotenv').config();

//Get routes
const loaderRoutes = require('./routes/loaderRoutes');

//initialize express
const app = express();

//Use cors
const corsConfig = {
  origin: [
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5000',
    'https://localhost:5000',
    'http://localhost:5500',
    'odunet.github.io/',
    'https://odunet.github.io',
    'https://odunet.github.io/CookieClientTest/',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  allowedHeaders: [
    'Content-Type',
    'set-cookie',
    'Access-Control-Allow-Credentials',
    'x-auth-token',
    'Authorization',
    'XX-Requested-With',
  ],
};
app.use(cors(corsConfig));

//intialize data parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Declare session
let sessionStore;

//Check environement
if (app.get('env') === 'production') {
  console.log('Production Environment');

  //Connect to DB
  connectDB();

  //Initialize session store
  sessionStore = MongoStore.create({
    mongoUrl: process.env.DATABASE_URI,
    ttl: 14 * 24 * 60 * 60,
  });
  // app.set('trust proxy', 1); // trust first proxy
  // sess.cookie.secure = true; // serve secure cookies
} else if (app.get('env') === 'development') {
  console.log('Development Environment');

  //Connect to DB
  connectDB();

  //Initialize session store
  sessionStore = MongoStore.create({
    mongoUrl: process.env.DATABASE_URI,
    ttl: 14 * 24 * 60 * 60,
  });

  // app.use(morgan('dev'));
} else if (app.get('env') === 'test') {
  console.log('Test Environment');

  sessionStore = null;
}

//initialize session
var sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
};

app.use(session(sess));

// PASSPORT //
//Passport config
require('./services/passport');
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());

//use flash middleware
app.use(flash());

//set glabal variable available in all middleware
app.use((req, res, next) => {
  res.locals.resgisterMsg = req.flash('resgisterMsg');
  res.locals.logoutMsg = req.flash('logoutMsg');
  res.locals.error = req.flash('error');
  next();
});

//Cookie parser
app.use(cookieParser());

//Set static folder
app.use(express.static(__dirname + '/../public'));

//Set views and register partials
let viewPath = path.join(__dirname, '/views');
app.set('view engine', '.hbs');
app.engine('.hbs', exphbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('views', viewPath);
// hbs.registerPartials(__dirname + '/views/partials', function (err) {}); Used for hbs module, not required for express-handlebars

//Use routes
app.use('/loader', loaderRoutes);

//Redirect Landing Route
app.use('/', (req, res) => {
  res.status(200).redirect('loader/index');
});

//Error Handler 404
app.use((req, res) => {
  res
    .status(404)
    .render('error', { errorCode: 404, errorMessage: 'Page not found' });
});

//Error Handler 500
app.use(function (error, req, res, next) {
  if (error) {
    res.status(500).render('error', {
      errorCode: 500,
      errorMessage: 'Internal Server Error',
      errDetails: req.errors,
    });
  }
});

module.exports = app;
