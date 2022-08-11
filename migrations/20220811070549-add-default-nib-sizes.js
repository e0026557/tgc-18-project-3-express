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
  db.insert('nib_sizes', ['nib_size'], ['Extra Fine']);
  db.insert('nib_sizes', ['nib_size'], ['Fine']);
  db.insert('nib_sizes', ['nib_size'], ['Medium']);
  db.insert('nib_sizes', ['nib_size'], ['Broad']);
  db.insert('nib_sizes', ['nib_size'], ['Extra Broad']);
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
