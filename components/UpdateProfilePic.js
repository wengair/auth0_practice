import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import useInput from '../hooks/useInput'

function UpdateProfilePic() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [picUrl, bindPicUrl, resetPicUrl] = useInput('')
  const [userMetadata, setUserMetadata] = useState(null)
  const updatePic = async () => {
    const domain = "madcollective.us.auth0.com"
    console.log('user in updatePic =')
    console.log(user)
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://madcollective.api.com/test/`,
        scope: "read:users",
      })
      console.log(accessToken)
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`
      
      const metadataResponse = await fetch(userDetailsByIdUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json'
        },
        body: {
          user_metadata: {
            picture: `${picUrl}`
          }
        }
      })

      const { user_metadata } = await metadataResponse.json()

      setUserMetadata(user_metadata)
    } catch (e) {
      console.log(e.message)
    }
  }
 
  return (
    isAuthenticated && (
      <div>
        <label>New Picture Url:</label>
        <input {...bindPicUrl} type="text"/>
        <button onClick={updatePic}>Submit</button>
      </div>
    )
  )
}

export default UpdateProfilePic
// https://imgur.com/r/PleX/uXzXHUO
// https://i.imgur.com/Kql7cQn.png
