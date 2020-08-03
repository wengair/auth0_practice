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

const Query = async(queryString) => {
  const [result, resultfields] = await promisePool.execute(queryString)
  return result
}

export default Query