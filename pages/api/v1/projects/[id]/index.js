import {applySiteMiddleware} from 'clients/lib/init-middleware'
import Query from 'clients/lib/query'

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
      let pid = Number(req.url.split('/').pop())
      console.log(`pid = ${pid}`)
      const project = await Query(`
        SELECT * FROM projects 
        WHERE id = ${pid}
      `)
      console.log(project)
      res.json(project)
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