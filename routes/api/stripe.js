// *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const dataLayer = require('../../dal/orders');
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

			// // Create new order using information from charge succeeded event
			// if (event.type == 'charge.succeeded') {
			// 	// Payment session information
			// 	let stripeSession = event.data.object;
			// 	console.log('charge succeeded => ', stripeSession);

			// 	sendResponse(res, 200, {
			// 		message: 'Charge success'
			// 	});
			// }

			// Create new order using information from checkout event
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

				// Retrieve charge information from payment intent
				const paymentIntent = await Stripe.paymentIntents.retrieve(
					stripeSession.payment_intent
				);
				const chargeId = paymentIntent.charges.data[0].id;
				const charge = await Stripe.charges.retrieve(chargeId);
				const receipt_url = charge.receipt_url;
				console.log('receipt_url => ', receipt_url);

				const payment_type = charge.payment_method_details.type;
				console.log('payment type => ', payment_type);

				// Retrieve selected shipping rate option
				const shippingRate = await Stripe.shippingRates.retrieve(
					stripeSession.shipping_rate
				);
				console.log(shippingRate);

				// Create new order
				const orderData = {
					total_cost: stripeSession.amount_total,
					user_id: metadata[0].user_id, // Just get user id from any line item
					order_status_id: 3, // Set order status as paid
					payment_type: payment_type,
					receipt_url: receipt_url,
					order_date: new Date(charge.created * 1000),
					payment_intent: stripeSession.payment_intent,
					shipping_option: shippingRate.display_name,
					billing_address_line1:
						stripeSession.customer_details.address.line1,
					billing_address_line2:
						stripeSession.customer_details.address.line2,
					billing_address_postal:
						stripeSession.customer_details.address.postal_code,
					billing_address_country:
						stripeSession.customer_details.address.country,
					shipping_address_line1:
						stripeSession.shipping.address.line1,
					shipping_address_line2:
						stripeSession.shipping.address.line2,
					shipping_address_postal:
						stripeSession.shipping.address.postal_code,
					shipping_address_country:
						stripeSession.shipping.address.country
				};

				const order = await dataLayer.addOrder(orderData);
				const orderId = order.get('id');
				console.log(orderId);

				// Create order items using order ID


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
