//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

// *** ROUTES ***
router.get('/', function (req, res) {
  res.redirect('/accounts/login');
})

module.exports = router;