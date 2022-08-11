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
  return db.createTable('variants', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    image_url: {
      type: 'string',
      length: 2048,
      notNull: true,
    },
    thumbnail_url: {
      type: 'string',
      length: 2048,
      notNull: true
    },
    cost: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    stock: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    },
    nib_material_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'variants_nib_material_fk',
        table: 'nib_materials',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    nib_shape_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'variants_nib_shape_fk',
        table: 'nib_shapes',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    nib_size_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'variants_nib_size_fk',
        table: 'nib_sizes',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    nib_flexibility_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'variants_nib_flexibility_fk',
        table: 'nib_flexibilities',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    color_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'variants_color_fk',
        table: 'colors',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    fountain_pen_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'variants_fountain_pen_fk',
        table: 'fountain_pens',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    }
  });
};

exports.down = function (db) {
  return db.dropTable('variants');
};

exports._meta = {
  "version": 1
};
