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
    return;
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
      sendDatabaseError(res);
    }
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

router.put('/:variant_id/update', async function (req, res) {
  const userId = req.user.id;
  const variantId = req.params.variant_id;
  const quantity = req.body.quantity;

  if (!userId || !variantId || !quantity) {
    sendResponse(res, 400, {
      error: 'Invalid parameter(s) specified'
    });
    return;
  }

  // Update quantity of cart item
  try {
    const result = await cartServices.updateCartItem(userId, variantId, quantity);
    if (result) {
      sendResponse(res, 200, {
        message: 'Cart item succesfully updated'
      });
    }
    else {
      sendDatabaseError(res);
    }
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

router.delete('/:variant_id/delete', async function (req, res) {
  const userId = req.user.id;
  const variantId = req.params.variant_id;

  if (!userId || !variantId) {
    sendResponse(res, 400, {
      error: 'Invalid parameter(s) specified'
    });
  }

  // Delete variant from user's cart
  try {
    const result = await cartServices.deleteCartItem(userId, variantId);
    if (result) {
      sendResponse(res, 200, {
        message: 'Variant successfully removed from cart'
      });
    }
    else {
      sendDatabaseError(res);
    }
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

module.exports = router;
