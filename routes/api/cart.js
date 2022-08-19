// *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const cartServices = require('../../services/carts');
const { sendResponse, sendDatabaseError } = require('../../utilities');

// *** ROUTES ***

router.get('/', async function (req, res) {
  const user = req.user; // From JWT token
  // Get user's cart 
  try {
    const cartItems = await cartServices.getCart(user.id);
    sendResponse(res, 200, {
      cartItems: cartItems
    })
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

module.exports = router;