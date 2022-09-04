//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const dataLayer = require('../dal/orders');
const { createOrderSearchForm, bootstrapField, createUpdateOrderForm } = require('../forms');

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

router.get('/:order_id/update', async function (req, res) {
  // Get order to be updated
  const order = await dataLayer.getOrderById(req.params.order_id);

  // Fetch all choices for update order form
  const orderStatuses = await dataLayer.getAllOrderStatuses();

  // Create update order form and populate with existing data
  const orderForm = createUpdateOrderForm({
    orderStatuses
  });

  orderForm.fields.order_status_id.value = order.get('order_status_id');
  orderForm.fields.order_date.value = order.get('order_date').toISOString().slice(0, 10);
  if (order.get('delivery_date')) {
    orderForm.fields.delivery_date.value = order.get('delivery_date');
  }

  res.render('orders/update', {
    form: orderForm.toHTML(bootstrapField)
  })
});

router.post('/:order_id/update', async function (req, res) {
  // Get order to be updated
  const orderId = req.params.order_id;
  const order = await dataLayer.getOrderById(orderId);

  // Fetch all choices for update order form
  const orderStatuses = await dataLayer.getAllOrderStatuses();

  // Process update order form
  const orderForm = createUpdateOrderForm({
    orderStatuses
  });
  orderForm.handle(req, {
    success: async function (form) {
      const { order_date, ...orderData } = form.data;

      try {
        await dataLayer.updateOrder(orderId, orderData);

        req.flash('success_messages', 'Order successfully updated');
        res.redirect('/orders');
      } catch (error) {
        console.log(error);
        req.flash('error_messages', 'An error occurred while updating order. Please try again');
        res.redirect(`/orders/${orderId}/update`);
      }
    },
    error: async function (form) {
      res.render('orders/update', {
        form: form.toHTML(bootstrapField)
      });
    },
    empty: async function (form) {
      res.render('orders/update', {
        form: form.toHTML(bootstrapField)
      });
    }
  });
})

module.exports = router;
