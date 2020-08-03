import { useAuth0 } from "@auth0/auth0-react"
var parseJwt = require('jsonwebtoken')

function expireCheck(accessToken) {
  const { getAccessTokenSilently } = useAuth0()
  console.log('in expireCheck, accessToken = ')
  console.log(accessToken)

  const isUserAboutToExpire = (accessToken) => {
    let decode = parseJwt.decode(accessToken, {complete: true})
    console.log('in JWT test, about to expire?')
    console.log(Date.now() > (decode.payload.exp * 1000 - 1000060000))
    return Date.now() > (decode.payload.exp * 1000 - 1000060000)
  }

  if(isUserAboutToExpire(accessToken)) {
    const newAccessToken = getAccessTokenSilently({
      audience: `https://${domain}/api/v2/`,
      scope: "update:current_user_metadata",
    })
    console.log(`after renewUserAccessToken, accessToken = ${newAccessToken}`)
    return newAccessToken
  }
  else {
    return accessToken
  }
}
export default expireCheck