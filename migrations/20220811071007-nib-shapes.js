'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('nib_shapes', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    nib_shape: {
      type: 'string',
      length: 50,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('nib_shapes');
};

exports._meta = {
  "version": 1
};
