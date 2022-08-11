// *** DEPENDENCIES ***
const bookshelf = require('../bookshelf');

const Property = bookshelf.model('Property', {
  tableName: 'properties'
});

const FillingMechanism = bookshelf.model('FillingMechanism', {
  tableName: 'filling_mechanisms'
});

module.exports = {
  Property,
  FillingMechanism
};