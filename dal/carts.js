// *** DEPENDENCIES ***
const { CartItem } = require('../models');

// *** FUNCTIONS ***

const getCartByUserId = async function (userId) {
	const cartItems = await CartItem.collection()
		.where({
			user_id: userId
		})
		.fetch({
			require: false,
			withRelated: [
				'user',
				'variant',
				'variant.nibFlexibility',
				'variant.nibSize',
				'variant.nibShape',
				'variant.nibMaterial',
				'variant.color',
				'variant.fountainPen',
				'variant.fountainPen.brand',
				'variant.fountainPen.properties',
				'variant.fountainPen.capType',
				'variant.fountainPen.fillingMechanisms',
				'variant.fountainPen.saleStatus'
			]
		});

	return cartItems;
};

const getCartItem = async function (userId, variantId) {
	const cartItem = await CartItem.where({
		user_id: userId,
		variant_id: variantId
	}).fetch({
		require: false
	});

	return cartItem;
};

const createCartItem = async function (userId, variantId, quantity) {
	const cartItem = new CartItem({
		user_id: userId,
		variant_id: variantId,
		quantity: quantity
	});

	await cartItem.save();
	return cartItem;
};

const updateCartItem = async function (userId, variantId, quantity) {
	// Get cart item to be updated
	const cartItem = await getCartItem(userId, variantId);

	// If cart item exists
	if (cartItem) {
		// Update quantity of cart item
		cartItem.set('quantity', quantity);
		await cartItem.save();
		return cartItem;
	} else {
		return false; // Indicate failure
	}
};

const deleteCartItem = async function (userId, variantId) {
	// Get cart item to be deleted
	const cartItem = await getCartItem(userId, variantId);

	// If cart item exists
	if (cartItem) {
		await cartItem.destroy();
		return true;
	} else {
		return false;
	}
};

module.exports = {
	getCartByUserId,
	getCartItem,
	createCartItem,
	updateCartItem,
	deleteCartItem
};
