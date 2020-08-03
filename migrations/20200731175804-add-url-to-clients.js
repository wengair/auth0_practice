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
  const addUrltoClients = () => db.runSql(`
ALTER TABLE clients
ADD url VARCHAR(255) NOT NULL
DEFAULT 'http://via.placeholder.com/200' -- this will replace the previous null value to this default value
  `)
  return addUrltoClients()
};

exports.down = function(db) {
  return null
};

exports._meta = {
  "version": 1
};
