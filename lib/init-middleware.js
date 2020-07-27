import Cors from 'cors'
let jwt = require('express-jwt')
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
// console.log('finish building JWT')

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD', 'PATCH'],
})
// console.log('finish building COR')

const applySiteMiddleware = (onSuccessFunction) => async (req, res) => {
  console.log('in applySiteMiddleware')
  // 1. check JWT
  try {
    console.log('in applySiteMiddleware -  JWT')
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
    console.log('in applySiteMiddleware -  COR')
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
    const checkScopes = jwtAuthz(req.requiredScope[req.method],{customScopeKey: 'https://test.com/userPermissions'}) // for permission
    console.log('in applySiteMiddleware -  Scope Check')
    await runMiddleware(req, res, checkScopes)
  }
  catch(err) {
    console.log("Scope Check err=")
    console.log(err)
    res.json({
      "name": "UnauthorizedError",
      "message": "User doesn't have permission to do the action",
      "code": "invalid_permission"
    }) // send error message in json to front-end
    return 
  }
  console.log('has passed JWT and CORS check')
  return onSuccessFunction(req, res)
}

export {applySiteMiddleware, addScope}