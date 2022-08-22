// *** DEPENDENCIES ***
const { Order, OrderItem } = require("../models");

// *** FUNCTIONS ***

// Note: This is done inside charge succeeded event which does not contain the shipping option
const addOrder = async function (orderData) {
  const order = new Order(orderData);
  await order.save();

  return order;
}

const addOrderItem = async function (orderItemData) {
  const orderItem = new OrderItem(orderItemData);
  await orderItem.save();

  return orderItem;
}

// TODO: SEARCH ORDERS BY 
// ANY 4:
// PRODUCT NAME, DATA, MIN/MAX COST, STATUS, CUSTOMER EMAIL, CUSTOMER NAME

// TODO: GET ORDER BY ORDER ID

// TODO: GET ORDER ITEMS BY ORDER ID

// TODO: UPDATE ORDER

module.exports = {
  addOrder,
  addOrderItem
};