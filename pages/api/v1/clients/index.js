import {applySiteMiddleware} from 'clients/lib/init-middleware'
const mysql = require('mysql2')
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
const promisePool = pool.promise()

export default applySiteMiddleware( 
  {
    // define the scope of each method here
    GET:["project:add","project:test"],
    POST:["project:update"]
  },
  async(req, res) => {

  console.log('in hello api')
  // console.log('req=')
  // console.log(req)
  switch (req.method) {
    case 'GET':
      // let users = rawClients.map(user => { return {name:user.name, user_id:user.user_id} })
      const [clientList, clientfields] = await promisePool.execute("SELECT * FROM clients")
      console.log(clientList)
      res.json(clientList)
      break
    case 'POST':
      res.statusCode = 200
      res.json({ name: 'John Doeeeae' , method: 'post' })
      break
    default:
      // res.statusCode = 405
      // res.end()
      res.status(405).end() //Method Not Allowed
      break
  }
})