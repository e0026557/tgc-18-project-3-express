// *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();
const orderDataLayer = require('../../dal/orders');
const productDataLayer = require('../../dal/products');
const cartServices = require('../../services/carts');
const { sendResponse, sendDatabaseError } = require('../../utilities');

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// *** ROUTES ***

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

			// Create new order using information from checkout event
			if (
				event.type == 'checkout.session.completed' ||
				event.type == 'checkout.session.async_payment_succeeded'
			) {
				// Payment session information
				let stripeSession = event.data.object;

				// Metadata information
				const metadata = JSON.parse(event.data.object.metadata.orders);

				const userId = metadata[0].user_id;

				// Retrieve charge information from payment intent
				const paymentIntent = await Stripe.paymentIntents.retrieve(
					stripeSession.payment_intent
				);
				const chargeId = paymentIntent.charges.data[0].id;
				const charge = await Stripe.charges.retrieve(chargeId);
				const receipt_url = charge.receipt_url;

				const payment_type = charge.payment_method_details.type;

				// Retrieve selected shipping rate option
				const shippingRate = await Stripe.shippingRates.retrieve(
					stripeSession.shipping_rate
				);

				// Create new order
				const orderData = {
					total_cost: stripeSession.amount_total,
					user_id: userId, // Just get user id from any line item
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

				const order = await orderDataLayer.addOrder(orderData);
				const orderId = order.get('id');

				// Create order items using order ID
				for (let lineItem of metadata) {
					const variantId = lineItem.variant_id;
					const quantity = lineItem.quantity;

					const orderItemData = {
						order_id: orderId,
						quantity: quantity,
						variant_id: variantId
					};

					await orderDataLayer.addOrderItem(orderItemData);

					// Update stock of variant
					const stock = await cartServices.getCurrentStock(variantId);
					await productDataLayer.updateVariant(variantId, {
						stock: stock - quantity
					});
				}

				// Empty user's cart
				await cartServices.emptyCart(userId);

				sendResponse(res, 201, {
					message: 'Order and order items successfully created'
				});
			}
		} catch (error) {
			console.log(error);
			sendDatabaseError(res);
		}
	}
);

module.exports = router;
