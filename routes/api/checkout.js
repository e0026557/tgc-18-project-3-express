// *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const cartServices = require('../../services/carts');
const { sendResponse } = require('../../utilities');

// *** ROUTES ***
router.get('/', async function (req, res) {
	// Get all cart items from user's cart
	const userId = req.user.id;
	const cartItems = (await cartServices.getCart(userId)).toJSON();

	// TODO: CREATE LINE ITEM
	let lineItems = [];
	let meta = [];
	for (let cartItem of cartItems) {
		// NOTE: Based on older Stripe API version
		console.log(cartItem);

		// Create a line item name based on product and variant
		const brand = cartItem.variant.fountainPen.brand.brand;
		const model = cartItem.variant.fountainPen.model;
		const color = cartItem.variant.color.color;

		const nibSize = cartItem.variant.nibSize.nib_size;
		const nibFlexibility = cartItem.variant.nibFlexibility.nib_flexibility;
		const nibShape = cartItem.variant.nibShape.nib_shape;
		const nibMaterial = cartItem.variant.nibMaterial.nib_material;

		const lineItemName = `${brand} ${model} (Color: ${color}, Nib: ${nibSize}, ${nibShape}, ${nibFlexibility}, ${nibMaterial})`;
		console.log(lineItemName);

		const lineItem = {
			name: lineItemName,
			amount: cartItem.variant.cost,
			quantity: cartItem.quantity,
			images: [cartItem.variant.thumbnail_url], // Note: Images must be in an array
			currency: 'SGD'
		};

		lineItems.push(lineItem);

		// Save meta data of each line item
		meta.push({
			user_id: cartItem.user_id,
			variant_id: cartItem.variant_id,
			quantity: cartItem.quantity
		});
	}

	// TODO: CREATE STRIPE PAYMENT SESSIONS
	let metaData = JSON.stringify(meta);
	const payment = {
		payment_method_types: ['card', 'grabpay', 'paynow'],
		billing_address_collection: 'required',
		shipping_address_collection: {
			allowed_countries: ['SG']
		},
		line_items: lineItems,
		success_url:
			process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
		cancel_url: process.env.STRIPE_CANCEL_URL,
		metadata: {
			orders: metaData
		},
		shipping_options: [
			{
				shipping_rate_data: {
					display_name: 'Normal Delivery',
					type: 'fixed_amount',
					fixed_amount: {
						amount: 500,
						currency: 'SGD'
					},
					delivery_estimate: {
						minimum: {
							unit: 'business_day',
							value: '5'
						},
						maximum: {
							unit: 'business_day',
							value: '7'
						}
					}
				}
			},
			{
				shipping_rate_data: {
					display_name: 'Express Delivery',
					type: 'fixed_amount',
					fixed_amount: {
						amount: 1000,
						currency: 'SGD'
					},
					delivery_estimate: {
						minimum: {
							unit: 'business_day',
							value: '1'
						},
						maximum: {
							unit: 'business_day',
							value: '2'
						}
					}
				}
			}
		],
		mode: 'payment'
	};

	// TODO: REGISTER STRIPE PAYMENT SESSIONS
	let stripeSession = await Stripe.checkout.sessions.create(payment);
	sendResponse(res, 200, {
		sessionId: stripeSession.id,
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
	});
});

module.exports = router;
