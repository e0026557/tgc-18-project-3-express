// *** DEPENDENCIES ***
const { Order, OrderItem, OrderStatus } = require('../models');

// *** FUNCTIONS ***

// Note: This is done inside charge succeeded event which does not contain the shipping option
const addOrder = async function (orderData) {
  const order = new Order(orderData);
  await order.save();

  return order;
};

const addOrderItem = async function (orderItemData) {
  const orderItem = new OrderItem(orderItemData);
  await orderItem.save();

  return orderItem;
};

const getAllOrders = async function () {
  const orders = await Order.collection().fetch({
    require: false,
    withRelated: [
      'user',
      'orderStatus',
      'orderItems',
      'orderItems.variant',
      'orderItems.variant.fountainPen',
      'orderItems.variant.fountainPen.brand'
    ]
  });

  return orders;
};

const getAllOrderStatuses = async function () {
  const orderStatuses = await OrderStatus.fetchAll().map((status) => {
    return [status.get('id'), status.get('order_status')];
  });

  return orderStatuses;
};

const filterOrdersBySearchFields = async function (form) {
  // Create query builder
  let query = Order.collection();

  if (form.data.customer_name) {
    if (process.env.DB_DRIVER == 'mysql') {
      query
        .query('join', 'users', 'users.id', 'user_id')
        .where('name', 'like', `%${form.data.customer_name}%`);
    } else {
      query
        .query('join', 'users', 'users.id', 'user_id')
        .where('name', 'ilike', `%${form.data.customer_name}%`);
    }
  }

  if (form.data.customer_email) {
    if (process.env.DB_DRIVER == 'mysql') {
      query
        .query('join', 'users', 'users.id', 'user_id')
        .where('email', 'like', `%${form.data.customer_email}%`);
    } else {
      query
        .query('join', 'users', 'users.id', 'user_id')
        .where('email', 'ilike', `%${form.data.customer_email}%`);
    }
  }

  if (form.data.order_status_id && form.data.order_status_id != 0) {
    query.where('order_status_id', '=', form.data.order_status_id);
  }

  if (form.data.from_order_date) {
    query.where('order_date', '>=', form.data.from_order_date);
  }

  if (form.data.to_order_date) {
    query.where('order_date', '<=', form.data.to_order_date);
  }

  const orders = await query.fetch({
    withRelated: [
      'user',
      'orderStatus',
      'orderItems',
      'orderItems.variant',
      'orderItems.variant.fountainPen',
      'orderItems.variant.fountainPen.brand'
    ]
  });

  return orders;
};

const getOrderById = async function (orderId) {
  const order = await Order.where({
    id: orderId
  }).fetch({
    require: true,
    withRelated: [
      'user',
      'orderStatus',
      'orderItems',
      'orderItems.variant',
      'orderItems.variant.fountainPen',
      'orderItems.variant.fountainPen.brand'
    ]
  });

  return order;
};

const updateOrder = async function (orderId, orderData) {
  // Get order to be updated
  const order = await getOrderById(orderId);

  // Set delivery date and order status
  order.set(orderData);
  await order.save();
  return true;
};

const getAllOrdersByUserId = async function (userId) {
  // Get all orders by user ID
  const orders = await Order.collection()
    .where({
      user_id: userId
    })
    .fetch({
      require: false,
      withRelated: [
        'user',
        'orderStatus',
        'orderItems',
        'orderItems.variant',
        'orderItems.variant.fountainPen',
        'orderItems.variant.fountainPen.brand'
      ]
    });

  return orders;
};

module.exports = {
  addOrder,
  addOrderItem,
  getAllOrders,
  getAllOrderStatuses,
  filterOrdersBySearchFields,
  getOrderById,
  updateOrder,
  getAllOrdersByUserId
};
