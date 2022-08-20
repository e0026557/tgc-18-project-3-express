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
    });
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

router.post('/:variant_id/add', async function (req, res) {
  const userId = req.user.id;
  const variantId = req.params.variant_id;
  const quantity = req.body.quantity;

  if (!userId || !variantId || !quantity) {
    sendResponse(res, 400, {
      error: 'Invalid parameter(s) specified'
    });
  }

  // Add variant to user's cart
  try {
    const result = await cartServices.addToCart(
      userId,
      variantId,
      quantity
    );
    if (result) {
      sendResponse(res, 200, {
        message: 'Item successfully added to cart'
      });
    } else {
      sendResponse(res, 400, {
        message: 'An error occurred while adding to cart'
      });
    }
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

// TODO: REMOVE FROM CART

// TODO: UPDATE CART

module.exports = router;
