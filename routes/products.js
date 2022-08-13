//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

const dataLayer = require('../dal/products');

// *** ROUTES ***

router.get('/', async function (req, res) {
  // Fetch all products and convert to JSON format
  let products = (await dataLayer.getAllProducts()).toJSON();

  // Format products for displaying in dashboard
  products = products.map((product) => {
    return {
      ...product,
      fillingMechanisms: product.fillingMechanisms.map(
        (obj) => obj.filling_mechanism
      ),
      totalStock: product.variants.map((obj) => obj.stock).reduce((prev, curr) => prev + curr),
      maxPrice: Math.max(...product.variants.map(obj => parseInt(obj.cost))),
      minPrice: Math.min(...product.variants.map(obj => parseInt(obj.cost)))
    };
  });

  console.log(products);
  res.render('products/index', {
    products: products
  });
});

module.exports = router;
