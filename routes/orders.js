//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const dataLayer = require('../dal/orders');
const { createOrderSearchForm, bootstrapField } = require('../forms');

// *** ROUTES ***

router.get('/', async function (req, res) {
  // Get all orders
  const orders = await dataLayer.getAllOrders();

  // Get all fields required for order search form
  const orderStatuses = await dataLayer.getAllOrderStatuses();
  orderStatuses.unshift([0, '--- Any Order Status ---']);

  const choices = {
    orderStatuses
  };

  // Create search form for orders
  const orderSearchForm = createOrderSearchForm(choices);

  orderSearchForm.handle(req, {
    success: async function (form) {
      const orders = await dataLayer.filterOrdersBySearchFields(form);

      res.render('orders/index', {
        orders: orders.toJSON(),
        form: form.toHTML(bootstrapField)
      });
    },
    error: async function (form) {
      res.render('orders/index', {
        orders: orders.toJSON(),
        form: form.toHTML(bootstrapField)
      });
    },
    empty: async function (form) {
      res.render('orders/index', {
        orders: orders.toJSON(),
        form: form.toHTML(bootstrapField)
      });
    }
  });
});

module.exports = router;
