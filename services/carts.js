// *** DEPENDENCIES ***
const cartDataLayer = require('../dal/carts');
const productDataLayer = require('../dal/products');

// *** FUNCTIONS ***

const getCurrentStock = async function (variantId) {
  const variant = await productDataLayer.getVariantById(variantId);
  return parseInt(variant.get('stock'));
};

const getCart = async function (userId) {
  const cartItems = await cartDataLayer.getCartByUserId(userId);
  return cartItems;
};

const addToCart = async function (userId, variantId, quantity) {
  try {
    // Check if variant to be added is already in user's cart
    const cartItem = await cartDataLayer.getCartItem(userId, variantId);

    // Get current stock of variant
    const stock = await getCurrentStock(variantId);

    if (cartItem) {
      // Update quantity of cart item if it is already in user's cart
      const currentQuantity = parseInt(cartItem.get('quantity'));

      // Check that total quantity of cart item does not exceed stock
      if (currentQuantity + quantity > stock) {
        return false;
      }

      await cartDataLayer.updateCartItem(
        userId,
        variantId,
        currentQuantity + quantity
      );
    } else {
      // Check that total quantity of cart item does not exceed stock
      if (quantity > stock) {
        return false;
      }

      // Create new cart item if it is not in user's cart
      await cartDataLayer.createCartItem(userId, variantId, quantity);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateCartItem = async function (userId, variantId, quantity) {
  // Get current stock
  const stock = await getCurrentStock(variantId);

  // If updated quantity exceeds stock, reject
  if (quantity > stock) {
    return false;
  }

  // Update quantity of cart item
  return await cartDataLayer.updateCartItem(userId, variantId, quantity);
};

const deleteCartItem = async function (userId, variantId) {
  return await cartDataLayer.deleteCartItem(userId, variantId);
};

module.exports = {
  getCurrentStock,
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem
};
