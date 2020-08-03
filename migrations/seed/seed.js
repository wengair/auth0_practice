require('dotenv').config()
const mysql = require('mysql2/promise')

// run this seed file by running 
// $ node ./migrations/seed/seed.js
// or
// $ npm run db:seed
// in root folder

console.log('in seed')

const seed = (async(number) => {
  // number = the number of client, project, and processList. projectProcessLists will be assign automatically.
  // create the connection to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });

  // clean old dummy data
  connection.execute(`DELETE FROM projectProcessListItemCompleteds`)
  connection.execute(`DELETE FROM projectProcessLists`)
  connection.execute(`UPDATE processListItems SET parentId = NULL`)
  connection.execute(`DELETE FROM processListItems`)
  connection.execute(`DELETE FROM processLists`)
  connection.execute(`DELETE FROM projects`)
  connection.execute(`DELETE FROM clients`)

  // insert new dummy data client and processList
  for (let i = 1; i <= number; i++) {
  connection.execute(`INSERT INTO clients (name) VALUES ('Client ${i}')`)
  connection.execute(`INSERT INTO processLists (name, ordering) VALUES ('List ${i}',${i})`)
  }
  // get the result in order to assign foreign keys later
  const [clientList, clientfields] = await connection.execute(`SELECT * FROM clients`)
  const [processListList, processListfields] = await connection.execute(`SELECT * FROM processLists`)
  
  // insert new dummy data project and connect with client and processList respectively
  for (let i = 1; i <= number; i++) {
    connection.execute(`INSERT INTO projects (name, clientId) VALUES ('Project ${i}', ${clientList[i - 1].id})`)
    const [project, projectfields] = await connection.execute(`SELECT * FROM projects WHERE name = 'Project ${i}'`)
    for (let j = 1; j < i; j++) {
      connection.execute(`INSERT INTO projectProcessLists (projectId,processListId) VALUES (${project[0].id},${processListList[j - 1].id})`)
    }
  }
  const [projectList, projectfields] = await connection.execute(`SELECT * FROM projects`)
  
  // insert new dummy data list item and connect with processList and it's parent list item
  for (let i = 1; i <= number; i++) {
    connection.execute(`INSERT INTO processListItems (title, description, processListId) VALUES ('Item ${i}', 'This is the description of Item ${i}', ${processListList[i - 1].id})`)
    const [listItem, listItemfields] = await connection.execute(`SELECT * FROM processListItems WHERE title = 'Item ${i}'`)
    for (let j = 1; j < i; j++) {
      connection.execute(`
      INSERT INTO processListItems (title, description, processListId, parentId) 
      VALUES ('Item ${i}-${j}', 'This is the description of Item ${i}-${j}', ${processListList[i - 1].id}, ${listItem[0].id})`)
    }
  }
  const [processListItemList, processListItemfields] = await connection.execute(`SELECT * FROM processListItems`)
  
  // insert new dummy data list item and connect with processList and it's parent list item
  for (let i = 1; i <= number; i++) {
    var dateNow = new Date()
    var date = dateNow.toISOString().split('T')[0] + ' ' + dateNow.toTimeString().split(' ')[0]
    connection.execute(`
    INSERT INTO projectProcessListItemCompleteds (dateStatusChanged, processListItemId, projectId, userId)
    VALUES ('${date}', ${processListItemList[i - 1].id}, ${projectList[i - 1].id}, 'auth0|5f109380afdb6c00132e3c67')`)
  }
  connection.end();
})(20) // run immediately  format: const name = ( () => {} )()
