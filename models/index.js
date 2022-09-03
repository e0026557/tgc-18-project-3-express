// *** DEPENDENCIES ***
// const { model } = require('../bookshelf');
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
  variants: function () {
    return this.hasMany('Variant');
  }
});

const NibSize = bookshelf.model('NibSize', {
  tableName: 'nib_sizes',
  variants: function () {
    return this.hasMany('Variant');
  }
});

const NibShape = bookshelf.model('NibShape', {
  tableName: 'nib_shapes',
  variants: function () {
    return this.hasMany('Variant');
  }
});

const NibMaterial = bookshelf.model('NibMaterial', {
  tableName: 'nib_materials',
  variants: function () {
    return this.hasMany('Variant');
  }
});

const Color = bookshelf.model('Color', {
  tableName: 'colors',
  variants: function () {
    return this.hasMany('Variant');
  }
});

const OrderStatus = bookshelf.model('OrderStatus', {
  tableName: 'order_statuses',
  orders: function () {
    return this.hasMany('Order');
  }
});

const Role = bookshelf.model('Role', {
  tableName: 'roles',
  users: function () {
    return this.hasMany('User');
  }
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
  variants: function () {
    return this.hasMany('Variant');
  }
});

const Variant = bookshelf.model('Variant', {
  tableName: 'variants',
  nibMaterial: function () {
    return this.belongsTo('NibMaterial');
  },
  nibShape: function () {
    return this.belongsTo('NibShape');
  },
  nibSize: function () {
    return this.belongsTo('NibSize');
  },
  nibFlexibility: function () {
    return this.belongsTo('NibFlexibility');
  },
  color: function () {
    return this.belongsTo('Color');
  },
  fountainPen: function () {
    return this.belongsTo('FountainPen');
  },
  cartItems: function () {
    return this.hasMany('CartItem');
  },
  orderItems: function () {
    return this.hasMany('OrderItem');
  }
});

const User = bookshelf.model('User', {
  tableName: 'users',
  role: function () {
    return this.belongsTo('Role');
  },
  cartItems: function () {
    return this.hasMany('CartItem');
  },
  orders: function () {
    return this.hasMany('Order');
  }
});

const CartItem = bookshelf.model('CartItem', {
  tableName: 'cart_items',
  user: function () {
    return this.belongsTo('User');
  },
  variant: function () {
    return this.belongsTo('Variant');
  }
});

const Order = bookshelf.model('Order', {
  tableName: 'orders',
  user: function () {
    return this.belongsTo('User');
  },
  orderStatus: function () {
    return this.belongsTo('OrderStatus');
  },
  orderItems: function () {
    return this.hasMany('OrderItem');
  }
});

const OrderItem = bookshelf.model('OrderItem', {
  tableName: 'order_items',
  order: function () {
    return this.belongsTo('Order');
  },
  variant: function () {
    return this.belongsTo('Variant');
  }
});

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
  tableName: 'blacklisted_tokens'
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
  FountainPen,
  Variant,
  User,
  CartItem,
  Order,
  OrderItem,
  BlacklistedToken
};
