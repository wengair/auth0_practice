import {applySiteMiddleware} from 'clients/lib/init-middleware'
import Query from 'clients/lib/query'

export default applySiteMiddleware( 
  {
    // define the scope of each method here
    GET:["project:add","project:test"],
    POST:["project:update"]
  },
  async(req, res) => {

  console.log('in project endpoint')
  // console.log('req=')
  // console.log(req)
  switch (req.method) {
    case 'GET':
      const projectList = await Query("SELECT * FROM projects")
      console.log(projectList)
      res.data = projectList
      res.json(projectList)
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