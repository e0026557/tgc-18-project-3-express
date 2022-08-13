//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

const dataLayer = require('../dal/products');
const { createProductForm, bootstrapField, createVariantForm } = require('../forms');

// *** ROUTES ***

router.get('/', async function (req, res) {
  // Fetch all products and convert to JSON format
  let products = (await dataLayer.getAllProducts()).toJSON();

  // Format products for displaying in dashboard
  products = products.map((product) => {
    return {
      ...product,
      // Extract only filling mechanism
      fillingMechanisms: product.fillingMechanisms.map(
        (obj) => obj.filling_mechanism
      ),
      // Calculate total stock
      totalStock: product.variants.map((obj) => obj.stock).reduce((prev, curr) => prev + curr),
      // Calculate max price
      maxPrice: Math.max(...product.variants.map(obj => parseInt(obj.cost))),
      // Calculate min price
      minPrice: Math.min(...product.variants.map(obj => parseInt(obj.cost)))
    };
  });

  // console.log(products);
  res.render('products/index', {
    products: products
  });
});

router.get('/create', async function (req, res) {
  const brands = await dataLayer.getAllBrands();
  const capTypes = await dataLayer.getAllCapTypes();
  const properties = await dataLayer.getAllProperties();
  const fillingMechanisms = await dataLayer.getAllFillingMechanisms();

  const attributes = {
    brands,
    capTypes,
    properties,
    fillingMechanisms
  };

  const productForm = createProductForm(attributes);

  res.render('products/create', {
    form: productForm.toHTML(bootstrapField),
  });
})

// TODO
router.get('/:product_id/variants', async function (req, res) {
  const product = (await dataLayer.getProductById(req.params.product_id)).toJSON();

  res.render('products/variants');
});

module.exports = router;
