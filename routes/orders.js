//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const dataLayer = require('../dal/orders');

// *** ROUTES ***

router.get('/', async function (req, res) {
  // Get all orders
  const orders = await dataLayer.getAllOrders();

  res.render('orders/index', {
    orders: orders.toJSON()
  });
});

module.exports = router;