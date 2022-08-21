let products = [
  {
    id: 2,
    model: 'Studio',
    weight: 310,
    diameter: 121,
    length: 126,
    description: 'This LAMY studio fountain pen has a matte dark blue lacquer finish with high gloss chrome grip. It has a propeller shaped bright chrome metal clip and an interchangeable silver steel nib. This fountain pen comes with a blue LAMY ink cartridge and a Z27 converter for use with bottled ink so you can get started writing right away.',
    brand_id: 1,
    sale_status_id: 1,
    cap_type_id: 5,
    image_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_100x.jpg?v=1525274563',
    thumbnail_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_100x.jpg?v=1525274563',
    brand: { id: 1, brand: 'Pilot' },
    capType: { id: 5, cap_type: 'Snap-cap' },
    variants: [[Object]],
    properties: [[Object]],
    fillingMechanisms: [[Object]],
    saleStatus: { id: 1, sale_status: 'Active' }
  }
];

let product = {
  id: 2,
  model: 'Studio',
  weight: 31,
  diameter: 12,
  length: 126,
  description: 'This LAMY studio fountain pen has a matte dark blue lacquer finish with high gloss chrome grip. It has a propeller shaped bright chrome metal clip and an interchangeable silver steel nib. This fountain pen comes with a blue LAMY ink cartridge and a Z27 converter for use with bottled ink so you can get started writing right away.',
  brand_id: 2,
  sale_status_id: 1,
  cap_type_id: 5,
  image_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_100x.jpg?v=1525274563',
  thumbnail_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_100x.jpg?v=1525274563',
  brand: { id: 2, brand: 'LAMY' },
  capType: { id: 5, cap_type: 'Snap-cap' },
  variants: [
    {
      id: 1,
      image_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_x67.jpg?v=1525274563',
      thumbnail_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_x67.jpg?v=1525274563',
      cost: 1000,
      stock: 10,
      nib_material_id: 1,
      nib_shape_id: 1,
      nib_size_id: 1,
      nib_flexibility_id: 1,
      color_id: 1,
      fountain_pen_id: 2
    },
    {
      id: 2,
      image_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_x67.jpg?v=1525274563',
      thumbnail_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_x67.jpg?v=1525274563',
      cost: 1000,
      stock: 15,
      nib_material_id: 1,
      nib_shape_id: 1,
      nib_size_id: 1,
      nib_flexibility_id: 1,
      color_id: 2,
      fountain_pen_id: 2
    }
  ],
  properties: [
    {
      id: 1,
      property: 'Postable',
      _pivot_fountain_pen_id: 2,
      _pivot_property_id: 1
    }
  ],
  fillingMechanisms: [
    {
      id: 1,
      filling_mechanism: 'Cartridge/Converter',
      _pivot_fountain_pen_id: 2,
      _pivot_filling_mechanism_id: 1
    }
  ],
  saleStatus: { id: 1, sale_status: 'Active' }
};


// SAMPLE CART ITEM
const cartItem = {
  id: 3,
  quantity: 2,
  user_id: 4,
  variant_id: 1,
  user: {
    id: 4,
    name: 'test2',
    username: 'test2',
    email: 'test2@gmail.com',
    password: 'YDA64iuZiGG847KPM+7BvnWKITyGyTwHbb6fVYwRx1I=',
    contact_number: '1234567',
    role_id: 1
  },
  variant: {
    id: 1,
    image_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_x67.jpg?v=1525274563',
    thumbnail_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_x67.jpg?v=1525274563',
    cost: 1000,
    stock: 10,
    nib_material_id: 1,
    nib_shape_id: 1,
    nib_size_id: 1,
    nib_flexibility_id: 1,
    color_id: 1,
    fountain_pen_id: 2,
    nibSize: { id: 1, nib_size: 'Extra Fine' },
    nibFlexibility: { id: 1, nib_flexibility: 'Soft' },
    nibShape: { id: 1, nib_shape: 'Round' },
    nibMaterial: { id: 1, nib_material: 'Stainless Steel' },
    color: { id: 1, color: 'Black' },
    fountainPen: {
      id: 2,
      model: 'Studio',
      weight: 31,
      diameter: 12,
      length: 126,
      description: 'This LAMY studio fountain pen has a matte dark blue lacquer finish with high gloss chrome grip. It has a propeller shaped bright chrome metal clip and an interchangeable silver steel nib. This fountain pen comes with a blue LAMY ink cartridge and a Z27 converter for use with bottled ink so you can get started writing right away.',
      brand_id: 2,
      sale_status_id: 2,
      cap_type_id: 5,
      image_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_100x.jpg?v=1525274563',
      thumbnail_url: 'https://cdn.shopify.com/s/files/1/2603/2528/products/Lamy-Studio-ImperialBlue-NW-2_100x.jpg?v=1525274563',
      brand: [Object],
      capType: [Object],
      fillingMechanisms: [Array],
      saleStatus: [Object],
      properties: [Array]
    }
  }
}

// SAMPLE LINE ITEM NAME 
const lineItemName = "LAMY Studio (Color: Black, Nib: Extra Fine, Round, Soft, Stainless Steel)"

// SAMPLE STRIPE PAYMENT SESSION RESPONSES
// 1. EVENT OBJECT FOR CHARGE SUCCEED
const event = {
  id: 'evt_3LZE5GKvC3BRLMzb1OWazphr',
  object: 'event',
  api_version: '2020-08-27',
  created: 1661088122,
  data: {
    object: {
      id: 'ch_3LZE5GKvC3BRLMzb1Z7Lllfs',
      object: 'charge',
      amount: 2500,
      amount_captured: 2500,
      amount_refunded: 0,
      application: null,
      application_fee: null,
      application_fee_amount: null,
      balance_transaction: 'txn_3LZE5GKvC3BRLMzb13iYkfVC',
      billing_details: [Object],
      calculated_statement_descriptor: 'Stripe',
      captured: true,
      created: 1661088122,
      currency: 'sgd',
      customer: 'cus_MHnhcKFlfgjZp0',
      description: null,
      destination: null,
      dispute: null,
      disputed: false,
      failure_balance_transaction: null,
      failure_code: null,
      failure_message: null,
      fraud_details: {},
      invoice: null,
      livemode: false,
      metadata: {},
      on_behalf_of: null,
      order: null,
      outcome: [Object],
      paid: true,
      payment_intent: 'pi_3LZE5GKvC3BRLMzb1BrEGzg5',
      payment_method: 'pm_1LZE6GKvC3BRLMzbt7Jn6QN8',
      payment_method_details: [Object],
      receipt_email: null,
      receipt_number: null,
      receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTFNFMUVLdkMzQlJMTXpiKPviiJgGMgaTrtuaa5Q6LBZSzsLoT1db4fR-MjZkLB3tG4yCZ5U43tw9iDig9v_eNHNTEcz84sFdhiKn',
      refunded: false,
      refunds: [Object],
      review: null,
      shipping: [Object],
      source: null,
      source_transfer: null,
      statement_descriptor: null,
      statement_descriptor_suffix: null,
      status: 'succeeded',
      transfer_data: null,
      transfer_group: null
    }
  },
  livemode: false,
  pending_webhooks: 4,
  request: {
    id: 'req_knNbwL1E0NuAZa',
    idempotency_key: 'c1ab378c-3de9-4724-b87a-646746a7c860'
  },
  type: 'charge.succeeded'
}

// EVENT.DATA.OBJECT FOR CHARGE SUCCEEDED
const chargeSucceeded = {
  id: 'ch_3LZE5GKvC3BRLMzb1Z7Lllfs',
  object: 'charge',
  amount: 2500,
  amount_captured: 2500,
  amount_refunded: 0,
  application: null,
  application_fee: null,
  application_fee_amount: null,
  balance_transaction: 'txn_3LZE5GKvC3BRLMzb13iYkfVC',
  billing_details: {
    address: {
      city: null,
      country: 'SG',
      line1: '6A Admiralty Road',
      line2: null,
      postal_code: '732006',
      state: null
    },
    email: 'admin@gmail.com',
    name: 'admin',
    phone: null
  },
  calculated_statement_descriptor: 'Stripe',
  captured: true,
  created: 1661088122,
  currency: 'sgd',
  customer: 'cus_MHnhcKFlfgjZp0',
  description: null,
  destination: null,
  dispute: null,
  disputed: false,
  failure_balance_transaction: null,
  failure_code: null,
  failure_message: null,
  fraud_details: {},
  invoice: null,
  livemode: false,
  metadata: {},
  on_behalf_of: null,
  order: null,
  outcome: {
    network_status: 'approved_by_network',
    reason: null,
    risk_level: 'normal',
    risk_score: 2,
    seller_message: 'Payment complete.',
    type: 'authorized'
  },
  paid: true,
  payment_intent: 'pi_3LZE5GKvC3BRLMzb1BrEGzg5',
  payment_method: 'pm_1LZE6GKvC3BRLMzbt7Jn6QN8',
  payment_method_details: {
    card: {
      brand: 'visa',
      checks: [Object],
      country: 'US',
      exp_month: 4,
      exp_year: 2044,
      fingerprint: 'kgYa16mTKVGb8K33',
      funding: 'credit',
      installments: null,
      last4: '4242',
      mandate: null,
      network: 'visa',
      three_d_secure: null,
      wallet: null
    },
    type: 'card'
  },
  receipt_email: null,
  receipt_number: null,
  receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTFNFMUVLdkMzQlJMTXpiKPviiJgGMgaTrtuaa5Q6LBZSzsLoT1db4fR-MjZkLB3tG4yCZ5U43tw9iDig9v_eNHNTEcz84sFdhiKn',
  refunded: false,
  refunds: {
    object: 'list',
    data: [],
    has_more: false,
    total_count: 0,
    url: '/v1/charges/ch_3LZE5GKvC3BRLMzb1Z7Lllfs/refunds'
  },
  review: null,
  shipping: {
    address: {
      city: '',
      country: 'SG',
      line1: '6A Admiralty Road',
      line2: null,
      postal_code: '732006',
      state: ''
    },
    carrier: null,
    name: 'admin',
    phone: null,
    tracking_number: null
  },
  source: null,
  source_transfer: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  status: 'succeeded',
  transfer_data: null,
  transfer_group: null
}

// EVENT FOR PAYMENT COMPLETED
const event2 = {
  id: 'evt_1LZE6KKvC3BRLMzbbCW2W2Te',
  object: 'event',
  api_version: '2020-08-27',
  created: 1661088124,
  data: {
    object: {
      id: 'cs_test_a15IhGfLrLPqEZ44dBZLgsm0m1bhZZ64HgoKApFczHqL9hv2hhr03v8wk3',
      object: 'checkout.session',
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 2000,
      amount_total: 2500,
      automatic_tax: [Object],
      billing_address_collection: 'required',
      cancel_url: 'https://www.google.com/?q=cancel',
      client_reference_id: null,
      consent: null,
      consent_collection: null,
      currency: 'sgd',
      customer: 'cus_MHnhcKFlfgjZp0',
      customer_creation: 'always',
      customer_details: [Object],
      customer_email: null,
      expires_at: 1661174457,
      livemode: false,
      locale: null,
      metadata: [Object],
      mode: 'payment',
      payment_intent: 'pi_3LZE5GKvC3BRLMzb1BrEGzg5',
      payment_link: null,
      payment_method_collection: 'always',
      payment_method_options: {},
      payment_method_types: [Array],
      payment_status: 'paid',
      phone_number_collection: [Object],
      recovered_from: null,
      setup_intent: null,
      shipping: [Object],
      shipping_address_collection: [Object],
      shipping_options: [Array],
      shipping_rate: 'shr_1LZE5FKvC3BRLMzb5HuOIhOA',
      status: 'complete',
      submit_type: null,
      subscription: null,
      success_url: 'https://www.google.com/?q=success?sessionId={CHECKOUT_SESSION_ID}',
      total_details: [Object],
      url: null
    }
  },
  livemode: false,
  pending_webhooks: 6,
  request: { id: null, idempotency_key: null },
  type: 'checkout.session.completed'
}

// EVENT.DATA.OBJECT FOR SESSION COMPLETED
const sessionCompleted = {
  id: 'cs_test_a15IhGfLrLPqEZ44dBZLgsm0m1bhZZ64HgoKApFczHqL9hv2hhr03v8wk3',
  object: 'checkout.session',
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 2000,
  amount_total: 2500,
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: 'required',
  cancel_url: 'https://www.google.com/?q=cancel',
  client_reference_id: null,
  consent: null,
  consent_collection: null,
  currency: 'sgd',
  customer: 'cus_MHnhcKFlfgjZp0',
  customer_creation: 'always',
  customer_details: {
    address: {
      city: null,
      country: 'SG',
      line1: '6A Admiralty Road',
      line2: null,
      postal_code: '732006',
      state: null
    },
    email: 'admin@gmail.com',
    name: 'admin',
    phone: null,
    tax_exempt: 'none',
    tax_ids: []
  },
  customer_email: null,
  expires_at: 1661174457,
  livemode: false,
  locale: null,
  metadata: { orders: '[{"user_id":4,"variant_id":1,"quantity":2}]' },
  mode: 'payment',
  payment_intent: 'pi_3LZE5GKvC3BRLMzb1BrEGzg5',
  payment_link: null,
  payment_method_collection: 'always',
  payment_method_options: {},
  payment_method_types: ['card', 'grabpay', 'paynow'],
  payment_status: 'paid',
  phone_number_collection: { enabled: false },
  recovered_from: null,
  setup_intent: null,
  shipping: {
    address: {
      city: '',
      country: 'SG',
      line1: '6A Admiralty Road',
      line2: null,
      postal_code: '732006',
      state: ''
    },
    name: 'admin'
  },
  shipping_address_collection: { allowed_countries: ['SG'] },
  shipping_options: [
    {
      shipping_amount: 500,
      shipping_rate: 'shr_1LZE5FKvC3BRLMzb5HuOIhOA'
    },
    {
      shipping_amount: 1000,
      shipping_rate: 'shr_1LZE5FKvC3BRLMzb5jjUrbbD'
    }
  ],
  shipping_rate: 'shr_1LZE5FKvC3BRLMzb5HuOIhOA',
  status: 'complete',
  submit_type: null,
  subscription: null,
  success_url: 'https://www.google.com/?q=success?sessionId={CHECKOUT_SESSION_ID}',
  total_details: { amount_discount: 0, amount_shipping: 500, amount_tax: 0 },
  url: null
}

// METADATA
const metadata = [{ user_id: 4, variant_id: 1, quantity: 2 }]

// SHIPPING RATE OPTION
const shippingRateOption = {
  id: 'shr_1LZE5FKvC3BRLMzb5HuOIhOA',
  object: 'shipping_rate',
  active: false,
  created: 1661088057,
  delivery_estimate: {
    maximum: { unit: 'business_day', value: 7 },
    minimum: { unit: 'business_day', value: 5 }
  },
  display_name: 'Normal Delivery',
  fixed_amount: { amount: 500, currency: 'sgd' },
  livemode: false,
  metadata: {},
  tax_behavior: 'unspecified',
  tax_code: null,
  type: 'fixed_amount'
}
