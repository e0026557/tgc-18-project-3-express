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
  db.insert('properties', ['property'], ['Postable']);
  db.insert('properties', ['property'], ['Retractable']);
  db.insert('properties', ['property'], ['Demonstrator']);
  db.insert('properties', ['property'], ['Disposable']);
  db.insert('properties', ['property'], ['Resin']);
  db.insert('properties', ['property'], ['Metal']);
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
