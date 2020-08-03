'use strict';

// const runSql = (db, query, params = []) => db.runSql(sqlstring.format(query, params))
// var dbm;
// var type;
// var seed;

// // /**
// //   * We receive the dbmigrate dependency from dbmigrate initially.
// //   * This enables us to not have to rely on NODE_PATH.
// //   */
// exports.setup = function(options, seedLink) {
//   dbm = options.dbmigrate;
//   type = dbm.dataType;
//   seed = seedLink;
// };

exports.up = function(db) {
  // const engineCharsetCollate = 'ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
  const populateClients = (n) => db.runSql(`INSERT INTO clients (name) VALUES ('Client ${n}')`)

  const populate = (number = 1) => {
    for (let i = 1; i <= number; i++) {
      console.log(i)
      // populateClients(i)
      // db.runSql(`INSERT INTO clients (name) VALUES ('Client ${i}')`)
      db.insert.bind(db, 'clients', ['name'], [`Client ${i}`])
    }
  }
  populate(20)
  return null
};

exports.down = function(db) {
  // return null
  return db.runSql(`DELETE FROM clients`)
  //   .then(db.runSql(`DROP TABLE processLists`))
  //   .then(db.runSql(`DROP TABLE projects`))
  //   .then(db.runSql(`DROP TABLE clients`))
};

exports._meta = {
  "version": 1
};
