// *** DEPENDENCIES ***
const bookshelf = require('../bookshelf');

// *** Models ***
const Brand = bookshelf.model('Brand', {
  tableName: 'brands',
  fountainPens: function () {
    return this.hasMany('FountainPen');
  }
});

const Property = bookshelf.model('Property', {
  tableName: 'properties',
  fountainPens: function () {
    return this.belongsToMany('FountainPen');
  }
});

const FillingMechanism = bookshelf.model('FillingMechanism', {
  tableName: 'filling_mechanisms',
  fountainPens: function () {
    return this.belongsToMany('FountainPen');
  }
});

const CapType = bookshelf.model('CapType', {
  tableName: 'cap_types',
  fountainPens: function () {
    return this.hasMany('FountainPen');
  }
});

const SaleStatus = bookshelf.model('SaleStatus', {
  tableName: 'sale_statuses',
  fountainPens: function () {
    return this.hasMany('FountainPen');
  }
});

const NibFlexibility = bookshelf.model('NibFlexibility', {
  tableName: 'nib_flexibilities'
});

const NibSize = bookshelf.model('NibSize', {
  tableName: 'nib_sizes'
});

const NibShape = bookshelf.model('NibShape', {
  tableName: 'nib_shapes'
});

const NibMaterial = bookshelf.model('NibMaterial', {
  tableName: 'nib_materials'
});

const Color = bookshelf.model('Color', {
  tableName: 'colors'
});

const OrderStatus = bookshelf.model('OrderStatus', {
  tableName: 'order_statuses'
});

const Role = bookshelf.model('Role', {
  tableName: 'roles'
});

const FountainPen = bookshelf.model('FountainPen', {
  tableName: 'fountain_pens',
  brand: function () {
    return this.belongsTo('Brand');
  },
  saleStatus: function () {
    return this.belongsTo('SaleStatus');
  },
  capType: function () {
    return this.belongsTo('CapType');
  },
  properties: function () {
    return this.belongsToMany('Property');
  },
  fillingMechanisms: function () {
    return this.belongsToMany('FillingMechanism');
  }
});

module.exports = {
  Brand,
  Property,
  FillingMechanism,
  CapType,
  SaleStatus,
  NibFlexibility,
  NibSize,
  NibShape,
  NibMaterial,
  Color,
  OrderStatus,
  Role,
  FountainPen
};