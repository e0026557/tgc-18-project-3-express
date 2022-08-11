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

module.exports = {
  Property,
  FillingMechanism,
  CapType,
  SaleStatus,
  NibFlexibility,
  NibSize
};