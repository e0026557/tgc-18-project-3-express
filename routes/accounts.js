//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

const dataLayer = require('../dal/accounts');
const { createRegistrationForm, bootstrapField } = require('../forms');

// *** ROUTES ***

// TODO
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
        req.flash('error_messages', 'An error occurred while registering. Please try again');
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
  })
});

// TODO
router.get('/login', function (req, res) {
  res.send('login page');
})

module.exports = router;