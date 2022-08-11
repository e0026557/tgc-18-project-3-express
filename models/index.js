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
  tableName: 'nib_flexibilities',
  variants: function() {
    return this.hasMany('Variant');
  }
});

const NibSize = bookshelf.model('NibSize', {
  tableName: 'nib_sizes',
  variants: function() {
    return this.hasMany('Variant');
  }
});

const NibShape = bookshelf.model('NibShape', {
  tableName: 'nib_shapes',
  variants: function() {
    return this.hasMany('Variant');
  }
});

const NibMaterial = bookshelf.model('NibMaterial', {
  tableName: 'nib_materials',
  variants: function() {
    return this.hasMany('Variant');
  }
});

const Color = bookshelf.model('Color', {
  tableName: 'colors',
  variants: function() {
    return this.hasMany('Variant');
  }
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
  },
  variants: function() {
    return this.hasMany('Variant');
  }
});

const Variant = bookshelf.model('Variant', {
  tableName: 'variants',
  nibMaterial: function() {
    return this.belongsTo('NibMaterial');
  },
  nibShape: function() {
    return this.belongsTo('NibShape');
  },
  nibSize: function() {
    return this.belongsTo('NibSize');
  },
  nibFlexibility: function() {
    return this.belongsTo('NibFlexibility');
  },
  color: function() {
    return this.belongsTo('Color');
  },
  fountainPen: function() {
    return this.belongsTo('FountainPen');
  }
})

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
  FountainPen,
  Variant
};