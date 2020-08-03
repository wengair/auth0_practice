'use strict';

// const util = require('util')
const sqlstring = require('sqlstring')
// import populate from './seed'

// db.runSql doesn't do placeholder replacement unless you pass a callback (for some reason). callbacks
// are depricated in db-migrate, so using sqlstring.
// const runSql = (db, query, params = []) => db.runSql(sqlstring.format(query, params))

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
  console.log('Building tables...')
  const engineCharsetCollate = 'ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci'

  const createClients = () => db.runSql(`
CREATE TABLE clients (
  id                  INT NOT NULL AUTO_INCREMENT,   -- a uuid
  name                VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ${engineCharsetCollate}
  `)

  const createProjects = () => db.runSql(`
CREATE TABLE projects (
  id                  INT NOT NULL AUTO_INCREMENT,   -- a uuid
  name                VARCHAR(255) NOT NULL,
  status              VARCHAR(255) NOT NULL DEFAULT 'processing', -- processing/completed/abandoned
  clientId            INT NOT NULL,                  -- a client's uuid
  PRIMARY KEY (id),
  UNIQUE (name),
  FOREIGN KEY (clientId) REFERENCES clients(id)
) ${engineCharsetCollate}
  `)

  const createProcessLists = () => db.runSql(`
CREATE TABLE processLists (
  id                  INT NOT NULL AUTO_INCREMENT,   -- a uuid
  name                VARCHAR(255) NOT NULL,
  ordering            INT NOT NULL,   -- the order that shows in the project
  PRIMARY KEY (id),
  UNIQUE (ordering)
) ${engineCharsetCollate}
  `)

  const createProjectProcessList = () => db.runSql(`
CREATE TABLE projectProcessLists (
  id                  INT NOT NULL AUTO_INCREMENT,   -- a uuid
  projectId           INT NOT NULL,                  -- a project's uuid
  processListId       INT NOT NULL,                  -- a process list's uuid
  PRIMARY KEY (id),
  FOREIGN KEY (projectId) REFERENCES projects(id),
  FOREIGN KEY (processListId) REFERENCES processLists(id)
) ${engineCharsetCollate}
  `)

  return  createClients()
    .then(console.log('Build clients table successfully'))
    .then(createProjects)
    .then(console.log('Build projects table successfully'))
    .then(createProcessLists)
    .then(console.log('Build lists table successfully'))
    .then(createProjectProcessList)
    .then(console.log('Build projectProcessLists (join table) successfully'))
}

exports.down = function(db) {
  // return db.runSql(`DROP TABLE clients`)
  return  db.runSql(`DROP TABLE projectProcessLists`)
    .then(db.runSql(`DROP TABLE processLists`))
    .then(db.runSql(`DROP TABLE projects`))
    .then(db.runSql(`DROP TABLE clients`))
}

exports._meta = {
  "version": 1
};