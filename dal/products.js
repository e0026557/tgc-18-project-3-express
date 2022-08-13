// *** DEPENDENCIES ***
const {
  FountainPen,
  Property,
  FillingMechanism,
  Brand,
  CapType,
  SaleStatus,
  Color,
  NibFlexibility,
  NibSize,
  NibShape,
  NibMaterial
} = require('../models');

// *** FUNCTIONS ***
const getAllProducts = async function () {
  const products = await FountainPen.collection().fetch({
    withRelated: [
      'brand',
      'capType',
      'variants',
      'properties',
      'fillingMechanisms',
      'saleStatus'
    ]
  });
  return products;
};

const getAllProperties = async function () {
  const properties = await Property.fetchAll().map((property) => {
    return [property.get('id'), property.get('property')];
  });

  return properties;
};

const getAllFillingMechanisms = async function () {
  const fillingMechanisms = await FillingMechanism.fetchAll().map(
    (fillingMechanism) => {
      return [
        fillingMechanism.get('id'),
        fillingMechanism.get('filling_mechanism')
      ];
    }
  );

  return fillingMechanisms;
};

const getAllBrands = async function () {
  const brands = await Brand.fetchAll().map((brand) => {
    return [brand.get('id'), brand.get('brand')];
  });

  return brands;
};

const getAllCapTypes = async function () {
  const capTypes = await CapType.fetchAll().map((capType) => {
    return [capType.get('id'), capType.get('cap_type')];
  });

  return capTypes;
};

const getAllSaleStatuses = async function () {
  const saleStatuses = await SaleStatus.fetchAll().map(saleStatus => {
    return [saleStatus.get('id'), saleStatus.get('sale_status')];
  });

  return saleStatuses;
}

const getAllColors = async function () {
  const colors = await Color.fetchAll().map(color => {
    return [color.get('id'), color.get('color')];
  });

  return colors;
};

const getAllNibFlexibilities = async function () {
  const nibFlexibilities = await NibFlexibility.fetchAll().map(flex => {
    return [flex.get('id'), flex.get('nib_flexibility')];
  })

  return nibFlexibilities;
}

const getAllNibSizes = async function () {
  const sizes = await NibSize.fetchAll().map(size => {
    return [size.get('id'), size.get('nib_size')];
  });

  return sizes;
}

const getAllNibShapes = async function () {
  const shapes = await NibShape.fetchAll().map(shape => {
    return [shape.get('id'), shape.get('nib_shape')];
  });

  return shapes;
}

const getAllNibMaterials = async function () {
  const materials = await NibMaterial.fetchAll().map(material => {
    return [material.get('id'), material.get('nib_material')];
  })

  return materials;
}

const getAllProductFormChoices = async function () {
  const brands = await getAllBrands();
  const capTypes = await getAllCapTypes();
  const properties = await getAllProperties();
  const fillingMechanisms = await getAllFillingMechanisms();

  return {
    brands,
    capTypes,
    properties,
    fillingMechanisms
  };
}

const getAllVariantFormChoices = async function () {
  const nibMaterials = await getAllNibMaterials();
  const nibFlexibilities = await getAllNibFlexibilities();
  const nibSizes = await getAllNibSizes();
  const nibShapes = await getAllNibShapes();
  const colors = await getAllColors();

  return {
    nibFlexibilities,
    nibMaterials,
    nibShapes,
    nibSizes,
    colors
  }
}

const getProductById = async function (productId) {
  const product = await FountainPen.where({
    id: productId
  }).fetch({
    withRelated: [
      'brand',
      'capType',
      'variants',
      'properties',
      'fillingMechanisms',
      'saleStatus'
    ],
    require: true
  });

  return product;
};

module.exports = {
  getAllProducts,
  getAllProperties,
  getAllFillingMechanisms,
  getAllBrands,
  getAllCapTypes,
  getAllSaleStatuses,
  getAllColors,
  getAllNibFlexibilities,
  getAllNibSizes,
  getAllNibShapes,
  getAllNibMaterials,
  getAllProductFormChoices,
  getAllVariantFormChoices,
  getProductById
};