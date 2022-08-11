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
  db.addColumn('fountain_pens', 'brand_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'fountain_pens_brand_fk',
      table: 'brands',
      mapping: 'id',
      rules: {
        onDelete: 'restrict',
        onUpdate: 'restrict'
      }
    }
  });

  db.addColumn('fountain_pens', 'sale_status_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    defaultValue: 1,
    foreignKey: {
      name: 'fountain_pens_sale_status_fk',
      table: 'sale_statuses',
      mapping: 'id',
      rules: {
        onDelete: 'restrict',
        onUpdate: 'restrict'
      }
    }
  });

  db.addColumn('fountain_pens', 'cap_type_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'fountain_pens_cap_type_fk',
      table: 'cap_types',
      mapping: 'id',
      rules: {
        onDelete: 'restrict',
        onUpdate: 'restrict'
      }
    }
  });
  return null;
};

exports.down = function (db) {
  db.removeColumn('fountain_pens', 'brand_id');
  db.removeColumn('fountain_pens', 'sale_status_id');
  db.removeColumn('fountain_pens', 'cap_type_id');
  return null;
};

exports._meta = {
  "version": 1
};
