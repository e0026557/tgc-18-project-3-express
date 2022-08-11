// *** DEPENDENCIES ***
const bookshelf = require('../bookshelf');

const Property = bookshelf.model('Property', {
  tableName: 'properties'
});

const FillingMechanism = bookshelf.model('FillingMechanism', {
  tableName: 'filling_mechanisms'
});

const CapType = bookshelf.model('CapType', {
  tableName: 'cap_types'
});

const SaleStatus = bookshelf.model('SaleStatus', {
  tableName: 'sale_statuses'
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
  tableName: 'fountain_pens'
});

module.exports = {
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