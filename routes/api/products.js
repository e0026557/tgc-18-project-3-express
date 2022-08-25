// *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const dataLayer = require('../../dal/products');
const { sendResponse, sendDatabaseError } = require('../../utilities');

// *** ROUTES ***
router.get('/', async function (req, res) {
  // Search criteria:
  // brand, model, filling mechanism, cap type, properties
  // cost, nib material, nib size, nib shape, nib flexibility, color

  const searchFields = req.query;

  // Retrieve all products
  try {
    const products = await dataLayer.searchProducts(searchFields);
    sendResponse(res, 200, {
      products
    });
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

router.get('/search_options', async function (req, res) {
  // Retrieve all options for searching products and variants
  const { saleStatuses, ...productOptions } =
    await dataLayer.getAllProductFormChoices();
  const variantOptions = await dataLayer.getAllVariantFormChoices();

  const options = {
    ...productOptions,
    ...variantOptions
  };

  sendResponse(res, 200, {
    options
  });
});

router.get('/:product_id', async function (req, res) {
  // Retrieve a product and its variants
  try {
    const product = await dataLayer.getProductById(req.params.product_id);
    sendResponse(res, 200, {
      product
    });
  } catch (error) {
    console.log(error);
    sendDatabaseError(res);
  }
});

module.exports = router;
