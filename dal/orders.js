// *** DEPENDENCIES ***
const { Order, OrderItem } = require("../models");

// *** FUNCTIONS ***

// Note: This is done inside charge succeeded event which does not contain the shipping option
const addOrder = async function (orderData) {
  const order = new Order(orderData);
  order.set('order_status_id', 3); // Set order status to paid
  order.set('shipping_option', 'Normal Delivery'); // Set shipping option to be normal delivery (to be later updated by checkout session event which contains the actual selected shipping option)
  order.set('order_date', new Date());
  await order.save();

  return order;
}

// TODO: CREATE NEW ORDER ITEM

// TODO: SEARCH ORDERS BY 
// ANY 4:
// PRODUCT NAME, DATA, MIN/MAX COST, STATUS, CUSTOMER EMAIL, CUSTOMER NAME

// TODO: GET ORDER BY ORDER ID

// TODO: GET ORDER ITEMS BY ORDER ID

// TODO: UPDATE ORDER

module.exports = {
  addOrder
};