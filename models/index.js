// *** DEPENDENCIES ***
const bookshelf = require('../bookshelf');

const Property = bookshelf.model('Property', {
  tableName: 'properties'
});

module.exports = {
  Property
};