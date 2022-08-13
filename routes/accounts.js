//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

// *** ROUTES ***
router.get('/login', function(req, res) {
  res.send('login page');
})

module.exports = router;