// *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const dataLayer = require('../../dal/orders');
const { sendResponse, sendDatabaseError } = require('../../utilities');

// *** ROUTES ***
router.get('/', async function (req, res) {
  // Get all orders made by user
  const userId = req.user.id;
  try {
    const orders = await dataLayer.getAllOrdersByUserId(userId);

    sendResponse(res, 200, {
      orders
    });
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

module.exports = router;

