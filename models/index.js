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

module.exports = {
  Property,
  FillingMechanism,
  CapType
};