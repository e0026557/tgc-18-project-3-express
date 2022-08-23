// *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const dataLayer = require('../../dal/products');
const { sendResponse, sendDatabaseError } = require('../../utilities');

// *** ROUTES ***
router.get('/', async function (req, res) {
  // Retrieve all products
  try {
    const products = await dataLayer.getAllProducts();
    sendResponse(res, 200, {
      products
    });
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

router.get('/:product_id', async function (req, res) {
  // Retrieve a product and its variants
  try {
    const product = await dataLayer.getProductById(req.params.product_id);
    sendResponse(res, 200, {
      product
    })
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

module.exports = router;
