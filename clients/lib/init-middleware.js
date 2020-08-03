import Cors from 'cors'
let jwt = require('express-jwt')
var parseJwt = require('jsonwebtoken');
let jwks = require('jwks-rsa')
let jwtAuthz = require('express-jwt-authz') 

const addScope = (handler,scope) => {
  // console.log('in addScope')
  return async (req, res) => {
    req.requiredScope = scope
    return handler(req, res);
  }
}

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if(result instanceof Error) {
        // console.log('has err in runMiddleware')
        return reject(result)
      }
      // console.log('no err in runMiddleware')
      return resolve(result)
    })
  })
}
// console.log('finish building runMiddleware')

const domain = process.env.DOMAIN
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://madcollective.us.auth0.com/.well-known/jwks.json'
  }),
  audience: `https://${domain}/api/v2/`,
  issuer: 'https://madcollective.us.auth0.com/',
  algorithms: ['RS256']
})
// console.log('finish building JWTCheck')

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD', 'PATCH'],
})
// console.log('finish building COR')

const applySiteMiddleware = (requiredScopes, next) => async (req, res) => {
  // console.log('in applySiteMiddleware')
  // console.log(requiredScopes)

  // 1. check JWT
  try {
    // console.log('in applySiteMiddleware -  JWT')
    await runMiddleware(req, res, jwtCheck)
  }
  catch(err) {
    console.log("JWT err=")
    console.log(err)
    res.json(err) // send error message in json to front-end
    return
  }
  // 2. apply CORS
  try {
    // console.log('in applySiteMiddleware -  COR')
    await runMiddleware(req, res, cors)
  }
  catch(err) {
    console.log("CORS err=")
    res.json(err) // send error message in json to front-end
    return
  }
  // // 3. check Scope
  try {
    // const checkScopes = jwtAuthz(req.body.scope) // for scope
    const checkScopes = jwtAuthz(requiredScopes[req.method],{customScopeKey: 'https://test.com/userPermissions'}) // for permission
    // console.log('in applySiteMiddleware -  Scope Check')
    await runMiddleware(req, res, checkScopes)
  }
  catch(err) {
    console.log("Scope Check err=")
    console.log(err)
    res.json({
      "name": "UnauthorizedError",
      "message": "User doesn't have permission to do the action",
      "code": 401
    }) // send error message in json to front-end
    return 
  }
  console.log('has passed JWT and CORS check')
  return next(req,res)
  // return onSuccessFunction(req, res)
}


let accessToken
let doing
let accessTokenP

const getAccessToken = async() => {
  if(doing) return accessTokenP
  let jwtExpired = await isAboutToExpire(accessToken)
  if(jwtExpired) {
    doing = true
    accessTokenP = new Promise((resolve, reject) => {
      try {
        console.log('before renewAccessToken')
        accessToken = renewAccessToken()
        doing = false
        console.log(`after renewAccessToken, accessToken = ${accessToken}`)
        resolve(accessToken)
      }
      // if this fails, the next call to this function will try to renew the access token, which is what we want 
      // (since we failed to renew it in this call, the next call will hopefully succeed)
      catch(err) {
        doing = false
        console.log("has error when try to get access token")
        reject(err)
      }
    })
  }
  return accessTokenP
}

const accessTokenMiddleware = next => async (req, res) => {
  try {
    req.accessToken = await getAccessToken()
    return next(req, res)
  }
  catch(err) {
    return res.status(500)
              .json({
                  errors: [{code: 'unknown-error', message: 'Something went wrong.'}],
              })
  }
}

const isAboutToExpire = async(accessToken) => {
  // console.log('in isAboutToExpire')
  let result = new Promise((resolve, reject) => {
    try {
      if (!accessToken) resolve(true)
      accessToken.then(token => {
        // console.log(`token = ${token}`)
        let decode = parseJwt.decode(token, {complete: true})
        // console.log(Date.now() > (decode.payload.exp * 1000 - 120000))
        resolve(Date.now() > (decode.payload.exp * 1000 - 60000))
      })
    }
    catch(err) {
      console.log("has error when try to check whether the token expired")
      reject(err)
    }
  })
  return result
}



const renewAccessToken = async() => {
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
// const applySiteMiddleware = (requiredParameters, next) => async (req, res) => {
// }

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
export {applySiteMiddleware, accessTokenMiddleware}