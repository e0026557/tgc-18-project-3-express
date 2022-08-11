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
  return db.createTable('filling_mechanisms_fountain_pens', {
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
        name: 'filling_mechanisms_fountain_pens_fountain_pen_fk',
        table: 'fountain_pens',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    filling_mechanism_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'filling_mechanisms_fountain_pens_filling_mechanism_fk',
        table: 'filling_mechanisms',
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
  return db.dropTable('filling_mechanisms_fountain_pens');
};

exports._meta = {
  "version": 1
};
