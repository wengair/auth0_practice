// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import jwtCheck from './index'
import {applySiteMiddleware, addScope} from '../../../lib/init-middleware'
import cookies from '../../../lib/cookies'
// // import nextConnect from 'next-connect'
console.log('in hello/index.js')

export default addScope(cookies(applySiteMiddleware( async(req, res) => {

  console.log('in hello api')
  switch (req.method) {
    case 'GET':
      // res.statusCode = 200
      // res.json({ name: 'John Doeeeae' , method: 'get'})

      // res.cookie('Next.js', 'api-middleware!')
      // res.end(res.getHeader('Set-Cookie'))
      
      const accessToken = await getAccessToken()
      const rawUsers = await getUsers(accessToken)
      let users = rawUsers.map(user => { return {name:user.name, user_id:user.user_id} })
      // console.log("result=")
      // console.log(users)
      res.json({users})
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
})),{
  // define the scope of each method here
  GET:["project:add","project:test"],
  POST:["project:remove"]
})

const getAccessToken = async() => {
  return await fetch('https://madcollective.us.auth0.com/oauth/token',{
    method: 'POST',
    body: JSON.stringify({
      client_id:"4kGxeEFGQ7ySmBLKOI2JqXANRW55K6rK",
      client_secret:"DGO_5sXNyEWp2DtTDR0jz1rr3qcCIl3zR0BGORj37efrOZ1QDQ9fo36VBJmWcQn4",
      audience:"https://madcollective.us.auth0.com/api/v2/",
      grant_type:"client_credentials"
   }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(res  => res.json())
  .then(json => {return json.access_token})
  .catch(err => console.log(err))
}

const getUsers = async(accessToken) => {
  console.log(accessToken)
  return await fetch('https://madcollective.us.auth0.com/api/v2/users',{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json'
    }
  })
  .then(res  => res.json())
  .then(users => {return users})
  .catch(err => console.log(err))
}

// export default (req, res) => {
//   res.statusCode = 200
//   res.setHeader('Content-Type', 'application/json')
//   res.end(JSON.stringify({ name: 'John Doeeee' }))
// }