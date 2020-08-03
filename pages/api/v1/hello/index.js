// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import jwtCheck from './index'
import {applySiteMiddleware, accessTokenMiddleware} from 'clients/lib/init-middleware'
import cookies from 'clients/lib/cookies'
// // import nextConnect from 'next-connect'
console.log('in hello/index.js')



// export default cookies(accessTokenMiddleware(applySiteMiddleware(
//   // define the scope of each method here
//   [
//       GET:["project:add","project:test"],
//       POST:["project:remove"]
//   ],
//   async(req, res) => {
//       const accessToken = req.accessToken
//   },
// )))
// export {applySiteMiddleware, addScope}



export default accessTokenMiddleware(applySiteMiddleware( 
  {
    // define the scope of each method here
    GET:["project:add","project:test"],
    POST:["project:remove"]
  },
  async(req, res) => {

  console.log('in hello endpoint')
  // console.log('req=')
  // console.log(req)
  switch (req.method) {
    case 'GET':
      // res.statusCode = 200
      // res.json({ name: 'John Doeeeae' , method: 'get'})

      
      const accessToken = req.accessToken
      // res.cookie('accessToken', accessToken)
      // res.end(res.getHeader('Set-Cookie'))
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
}))
// ,{
//   // define the scope of each method here
//   GET:["project:add","project:test"],
//   POST:["project:remove"]
// })

// const getAccessToken = async() => {
//   return await fetch('https://madcollective.us.auth0.com/oauth/token',{
//     method: 'POST',
//     body: JSON.stringify({
//       client_id:"4kGxeEFGQ7ySmBLKOI2JqXANRW55K6rK",
//       client_secret:"DGO_5sXNyEWp2DtTDR0jz1rr3qcCIl3zR0BGORj37efrOZ1QDQ9fo36VBJmWcQn4",
//       audience:"https://madcollective.us.auth0.com/api/v2/",
//       grant_type:"client_credentials"
//    }),
//     headers: {
//       'content-type': 'application/json'
//     }
//   })
//   .then(res  => res.json())
//   .then(json => {return json.access_token})
//   .catch(err => console.log(err))
// }

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