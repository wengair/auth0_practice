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
  switch (req.method) {
    case 'GET':
      let link = req.url.split('/')
      console.log(link)
      let pid = link[link.length - 2]
      console.log(`pid = ${pid}`)
      var result = await Query(`
      SELECT * FROM processLists
      JOIN projectProcessLists ON processLists.id = projectProcessLists.processListId
      WHERE projectProcessLists.projectId = ${pid}
      `)
      console.log(result)
      res.json(result)
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