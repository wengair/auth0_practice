// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwtCheck from './index'

// export default (req, res) => {
//   res.statusCode = 200
//   res.json({ name: 'John Doeeee' })
// }

export default function handler(req, res) {
  console.log('res=') // The request body
  console.log(res) // The request body
  console.log('req.body=') // The request body
  console.log(req.body) // The request body
  console.log('req.query=') // The url query string
  console.log(req.query) // The url query string
  console.log('req.cookies=') // The passed cookies
  console.log(req.cookies) // The passed cookies
  console.log(process.env.PORT)
  res.end('Hello World')
}

// export default (req, res) => {
//   res.statusCode = 200
//   res.setHeader('Content-Type', 'application/json')
//   res.end(JSON.stringify({ name: 'John Doeeee' }))
// }
