'use strict';

// const util = require('util')
const sqlstring = require('sqlstring')

// db.runSql doesn't do placeholder replacement unless you pass a callback (for some reason). callbacks
// are depricated in db-migrate, so using sqlstring.
const runSql = (db, query, params = []) => db.runSql(sqlstring.format(query, params))

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
  const engineCharsetCollate = 'ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci'

  const createClients = () => db.runSql(`
CREATE TABLE clients (
  id                  BINARY(16) NOT NULL,   -- a uuid
  name                VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
) ${engineCharsetCollate}
  `)

  const createProjects = () => db.runSql(`
CREATE TABLE projects (
  id                  BINARY(16) NOT NULL,   -- a uuid
  name                VARCHAR(255) NOT NULL,
  status              VARCHAR(255) NOT NULL, --processing/completed/abandoned
  clientId            BINARY(16) NOT NULL,   -- a client's uuid
  PRIMARY KEY (id),
  UNIQUE (name)
  FOREIGN KEY (clientId) REFERENCES clients(id)
) ${engineCharsetCollate}
  `)

  const createProcessLists = () => db.runSql(`
CREATE TABLE processLists (
  id                  BINARY(16) NOT NULL,   -- a uuid
  name                VARCHAR(255) NOT NULL,
  order               BINARY(16) NOT NULL,   -- the order that shows in the project
  PRIMARY KEY (id),
) ${engineCharsetCollate}
  `)

  const createProjectProcessList = () => db.runSql(`
CREATE TABLE projectProcessList (
  id                  BINARY(16) NOT NULL,   -- a uuid
  projectId           BINARY(16) NOT NULL,   -- a project's uuid
  processListId       BINARY(16) NOT NULL,   -- a uuid
  PRIMARY KEY (id),
  FOREIGN KEY (projectId) REFERENCES projects(id)
  FOREIGN KEY (processListId) REFERENCES processLists(id)
) ${engineCharsetCollate}
  `)
  return createClients()
    .then(createProjects)
    .then(createProcessLists)
    .then(createProjectProcessList)
}

exports.down = function(db) {
  return db.runSql(`DROP TABLE projectProcessList`)
  .then(db.runSql(`DROP TABLE processLists`))
    .then(db.runSql(`DROP TABLE projects`))
    .then(db.runSql(`DROP TABLE clients`))
}

exports._meta = {
  "version": 1
};