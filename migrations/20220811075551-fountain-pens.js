'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('fountain_pens', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    model: {
      type: 'string',
      length: 100,
      notNull: true
    },
    weight: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    },
    diameter: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    },
    length: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    },
    description: {
      type: 'text',
      notNull: true
    }
  });
};

exports.down = function (db) {
  return db.dropTable('fountain_pens');
};

exports._meta = {
  "version": 1
};
