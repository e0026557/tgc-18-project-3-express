// *** DEPENDENCIES ***
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
});
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');
require('dotenv').config();

// *** SETUP ***
// Create instance of Express app
const app = express();

// Set hbs as view engine
app.set('view engine', 'hbs');

// Set hbs partials
hbs.registerPartials('./views/partials');

// Set up static folder
app.use(express.static('public'));

// Set up wax-on for template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

const PORT = process.env.PORT || 3000;

// *** GLOBAL MIDDLEWARES ***
// Enable cross-site origin resource sharing
app.use(cors());

// Enable form processing (required for CSRF token to work in forms)
app.use(express.urlencoded({
  extended: false
}));

// Set up sessions
app.use(session({
  store: new FileStore(), // use file to store sessions
  secret: process.env.SESSION_SECRET, // used to generate session id
  resave: false, // whether to recreate the session even if there is no change to it
  saveUninitialized: true // whether to create a new session when a new browser connects
}));

// Set up flash messages (requires sessions)
app.use(flash());

// Share flash messages with hbs files
app.use(function (req, res, next) {
  // res.locals will contain all the variables available to hbs files
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

//  Enable CSRF protection
const csrfInstance = csrf();
app.use(function (req, res, next) {
  // console.log('Checking for csrf exclusion');
  if (req.url === '/checkout/process_payment' || req.url.slice(0, 5) == '/api/') {
    next();
  }
  else {
    csrfInstance(req, res, next);
  }
});

// Share CSRF with hbs files (must be included for all forms otherwise invalid CSRF error)
app.use(function (req, res, next) {
  // Check if req.csrfToken is available
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

// Share user data across all hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// *** ROUTES ***
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const accountRoutes = require('./routes/accounts');

app.use('/', landingRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/accounts', accountRoutes);


// *** SERVER ***
app.listen(PORT, function () {
  console.log('Server has started')
})