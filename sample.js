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
    variants: [ [Object] ],
    properties: [ [Object] ],
    fillingMechanisms: [ [Object] ],
    saleStatus: { id: 1, sale_status: 'Active' }
  }
];

let product = {
  s
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