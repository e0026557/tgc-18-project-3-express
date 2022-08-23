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
    withRelated: ['user', 'orderStatus', 'orderItems', 'orderItems.variant', 'orderItems.variant.fountainPen', 'orderItems.variant.fountainPen.brand']
  });

  return orders;
};

const getAllOrderStatuses = async function () {
  const orderStatuses = await OrderStatus.fetchAll().map((status) => {
    return [status.get('id'), status.get('order_status')];
  });

  return orderStatuses;
};

// TODO: SEARCH ORDERS BY
const filterOrdersBySearchFields = async function (form) {
  // Create query builder
  let query = Order.collection();

  if (form.data.customer_name) {
    query
      .query('join', 'users', 'users.id', 'user_id')
      .where('name', 'like', `%${form.data.customer_name}%`);
  }

  if (form.data.customer_email) {
    query
      .query('join', 'users', 'users.id', 'user_id')
      .where('email', 'like', `%${form.data.customer_email}%`);
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
    withRelated: ['user', 'orderStatus', 'orderItems']
  });

  return orders;
};

// TODO: GET ORDER BY ORDER ID

// TODO: GET ORDER ITEMS BY ORDER ID

// TODO: UPDATE ORDER

module.exports = {
  addOrder,
  addOrderItem,
  getAllOrders,
  getAllOrderStatuses,
  filterOrdersBySearchFields
};
