import { useAuth0 } from "@auth0/auth0-react"
var parseJwt = require('jsonwebtoken')

function useCheckExpire(accessToken) {
  const { getAccessTokenSilently } = useAuth0()
  
  const isUserAboutToExpire = (accessToken) => {
    let decode = parseJwt.decode(accessToken, {complete: true})
    console.log('in JWT test, about to expire?')
    console.log(Date.now() > (decode.payload.exp * 1000 - 60000))
    return Date.now() > (decode.payload.exp * 1000 - 60000)
  }

  const checkTokenExpired = async(accessToken) =>{
    console.log('in useCheckExpire - checkTokenExpired, accessToken =')
    console.log(accessToken)
    if(isUserAboutToExpire(accessToken)) {
      const newAccessToken = await getAccessTokenSilently({
        audience: `https://${process.env.DOMAIN}/api/v2/`,
        scope: "update:current_user_metadata",
      })
      console.log(`after renewUserAccessToken, accessToken = ${newAccessToken}`)
      localStorage.setItem('accessToken', newAccessToken)
      return newAccessToken
    }
    else {
      return accessToken
    }
  }
  return [checkTokenExpired]
}

export default useCheckExpire
