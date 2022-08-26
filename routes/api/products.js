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
  const brands = await dataLayer.getAllBrands();
  brands.unshift([0, '--- Any Brand ---']);

  const capTypes = await dataLayer.getAllCapTypes();
  capTypes.unshift([0, '--- Any Cap Type ---']);

  const properties = await dataLayer.getAllProperties();
  properties.unshift([0, '--- Any Property ---']);

  const fillingMechanisms = await dataLayer.getAllFillingMechanisms();
  fillingMechanisms.unshift([0, '--- Any Filling Mechanism ---']);

  const nibFlexibilities = await dataLayer.getAllNibFlexibilities();
  nibFlexibilities.unshift([0, '--- Any Nib Flexibility ---']);

  const nibMaterials = await dataLayer.getAllNibMaterials();
  nibMaterials.unshift([0, '--- Any Nib Material ---']);

  const nibShapes = await dataLayer.getAllNibShapes();
  nibShapes.unshift([0, '--- Any Nib Shape ---']);

  const nibSizes = await dataLayer.getAllNibSizes();
  nibSizes.unshift([0, '--- Any Nib Size ---']);

  const colors = await dataLayer.getAllColors();
  colors.unshift([0, '--- Any Color ---']);

  const options = {
    brands,
    capTypes,
    properties,
    fillingMechanisms,
    nibFlexibilities,
    nibMaterials,
    nibShapes,
    nibSizes,
    colors
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
