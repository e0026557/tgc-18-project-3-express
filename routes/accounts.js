//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const dataLayer = require('../dal/accounts');
const {
  createRegistrationForm,
  bootstrapField,
  createLoginForm
} = require('../forms');
const { checkIfAuthenticated } = require('../middlewares');

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
      // Extract user data from form data
      const { confirm_password, ...userData } = form.data;

      // Create new user
      try {
        const user = await dataLayer.addUser(userData, 2);
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

      // If user does not exist
      if (!user) {
        req.flash('error_messages', 'Invalid username and/or password');
        res.redirect('/accounts/login');
      } else {
        // Check that user is either an admin or staff (role id is 2 or 3)
        if (user.get('role_id') == 1) {
          req.flash(
            'error_messages',
            'Invalid username and/or password'
          );
          res.redirect('/accounts/login');
          return;
        }

        // Save user to session data
        req.session.user = {
          id: user.get('id'),
          username: user.get('username'),
          role: user.related('role').get('role')
        };

        req.flash(
          'success_messages',
          `Welcome back, ${user.get('username')}`
        );

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

router.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success_messages', 'Successfully logged out');

  res.redirect('/accounts/login');
});

router.get('/view', checkIfAuthenticated, async function (req, res) {
  const userId = req.session.user.id;
  try {
    const user = await dataLayer.getUserById(userId);
    res.render('accounts/profile', {
      user: user.toJSON()
    });
  } catch (error) {
    console.log(error);
    req.flash('error_messages', 'An error occurred while retrieving account information. Please try again');
    res.redirect('/accounts/view');
  }

});

module.exports = router;
