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
  console.log('Building tables...')
  const engineCharsetCollate = 'ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci'

  const createProcessListItems = () => db.runSql(`
CREATE TABLE processListItems (
  id                  INT NOT NULL AUTO_INCREMENT,   -- a uuid
  title               VARCHAR(255) NOT NULL,
  description         VARCHAR(255),
  processListId       INT NOT NULL,                  -- a processList's uuid
  parentId            INT,                           -- a processListItem's uuid, means this item is a child of another item
  PRIMARY KEY (id),
  FOREIGN KEY (processListId) REFERENCES processLists(id),
  FOREIGN KEY (parentId) REFERENCES processListItems(id)
) ${engineCharsetCollate}
  `)

  const createProjectProcessListItemCompleteds = () => db.runSql(`
CREATE TABLE projectProcessListItemCompleteds (
  id                  INT NOT NULL AUTO_INCREMENT,               -- a uuid
  status              VARCHAR(255) NOT NULL DEFAULT 'completed', -- processing/completed
  dateStatusChanged   DATETIME NOT NULL,
  processListItemId   INT NOT NULL,                              -- a processListItem's uuid
  userId              VARCHAR(255) NOT NULL,                     -- a user's uuid in Auth0
  projectId           INT NOT NULL,                              -- a project's uuid
  PRIMARY KEY (id),
  FOREIGN KEY (processListItemId) REFERENCES processListItems(id),
  FOREIGN KEY (projectId) REFERENCES projects(id)
) ${engineCharsetCollate}
  `)
  return createProcessListItems()
   .then(console.log('Build list items table successfully'))
   .then(createProjectProcessListItemCompleteds)
   .then(console.log('Build projectProcessListItemCompleteds (join table) successfully'))
};

exports.down = function(db) {
  return db.runSql(`DROP TABLE projectProcessListItemCompleteds`)
   .then(db.runSql(`DROP TABLE processListItems`))
};

exports._meta = {
  "version": 1
};
