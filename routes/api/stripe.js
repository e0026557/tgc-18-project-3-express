// *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const { sendResponse, sendDatabaseError } = require('../../utilities');

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// *** ROUTES ***

// TODO:
// 1. Create new order
// 2. Create new order items
// 3. Update stock of variants
// 4. Clear user cart
router.post(
	'/process_payment',
	express.raw({ type: 'application/json' }),
	async function (req, res) {
		let payload = req.body; // Payment information is inside req.body
		let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
		let sigHeader = req.headers['stripe-signature']; // When stripe sends the information, there will be a signature and the key will be 'stripe-signature'
		let event = null;

		// Try to extract out the payment information and verify that it actually comes from Stripe)
		try {
			event = Stripe.webhooks.constructEvent(
				payload,
				sigHeader,
				endpointSecret
			);
			console.log('event => ', event);

			if (event.type == 'charge.succeeded') {
				// Payment session information
				let stripeSession = event.data.object;
				console.log('charge succeeded => ', stripeSession);
				sendResponse(res, 200, {
					message: 'Charge success'
				});
			}

			if (
				event.type == 'checkout.session.completed' ||
				event.type == 'checkout.session.async_payment_succeeded'
			) {
				// Payment session information
				let stripeSession = event.data.object;
				console.log('session completed => ', stripeSession);

				// Metadata information
				const metadata = JSON.parse(event.data.object.metadata.orders);
				console.log(metadata);

				// Retrieve selected shipping rate option
				const shippingRate = await Stripe.shippingRates.retrieve(
					stripeSession.shipping_rate
				);
				console.log(shippingRate);
				sendResponse(res, 200, {
					message: 'Checkout success'
				});
			}
		} catch (error) {
			console.log(error);
			sendDatabaseError(res);
		}
	}
);

module.exports = router;
