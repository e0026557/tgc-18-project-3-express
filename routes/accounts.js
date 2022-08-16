//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

const dataLayer = require('../dal/accounts');
const {
  createRegistrationForm,
  bootstrapField,
  createLoginForm
} = require('../forms');

// *** ROUTES ***

router.get('/register', function (req, res) {
  const registerForm = createRegistrationForm();

  res.render('accounts/register', {
    form: registerForm.toHTML(bootstrapField)
  });
});

router.post('/register', async function (req, res) {
  const registerForm = createRegistrationForm();

  // Process registration form
  registerForm.handle(req, {
    success: async function (form) {
      // Create new user
      try {
        const user = await dataLayer.addUser(form.data);
        req.flash('success_messages', 'Registered successfully');
        res.redirect('/accounts/login');
      } catch (error) {
        console.log(error);
        req.flash(
          'error_messages',
          'An error occurred while registering. Please try again'
        );
        res.redirect('/accounts/register');
      }
    },
    error: function (form) {
      res.render('accounts/register', {
        form: form.toHTML(bootstrapField)
      });
    },
    empty: function (form) {
      res.render('accounts/register', {
        form: form.toHTML(bootstrapField)
      });
    }
  });
});

router.get('/login', function (req, res) {
  const loginForm = createLoginForm();

  res.render('accounts/login', {
    form: loginForm.toHTML(bootstrapField)
  });
});

router.post('/login', async function (req, res) {
  const loginForm = createLoginForm();

  // Process login form
  // -> NOTE: Generic error message for security
  loginForm.handle(req, {
    success: async function (form) {
      // Find user by username and password
      const user = await dataLayer.getUserByCredentials(form.data);
      console.log('user data => ', user.toJSON())

      // If user does not exist
      if (!user) {
        req.flash('error_messages', 'Invalid username and/or password');
        res.redirect('/accounts/login');
      }
      else {
        // Save user to session data
        req.session.user = {
          id: user.get('id'),
          username: user.get('username'),
          role: user.related('role').get('role')
        };

        req.flash('success_messages', `Welcome back, ${user.get('username')}`);

        // Redirect user to intended path before login
        const redirectTo = req.session.redirectTo || '/products';
        req.session.redirectTo = null; // clear redirectTo
        res.redirect(redirectTo);
      }

    },
    error: function (form) {
      res.render('accounts/login', {
        form: form.toHTML(bootstrapField)
      });
    },
    empty: function (form) {
      res.render('accounts/login', {
        form: form.toHTML(bootstrapField)
      });
    }
  });
});

module.exports = router;
