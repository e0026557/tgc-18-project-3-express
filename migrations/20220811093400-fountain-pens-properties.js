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
  return db.createTable('fountain_pens_properties', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    fountain_pen_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'fountain_pens_properties_fountain_pen_fk',
        table: 'fountain_pens',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    property_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'fountain_pens_properties_property_fk',
        table: 'properties',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    }
  });
};

exports.down = function (db) {
  return db.dropTable('fountain_pens_properties');
};

exports._meta = {
  "version": 1
};
