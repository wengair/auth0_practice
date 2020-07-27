import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import useInput from '../hooks/useInput'

function UpdateProfilePic() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [picUrl, bindPicUrl, resetPicUrl] = useInput('')
  const [userMetadata, setUserMetadata] = useState(null)
    const domain = "madcollective.us.auth0.com"
  
  const updatePic = async () => {
    // console.log('user in updatePic =')
    // console.log(user)
    try {
      const accessToken = await getAccessTokenSilently({
        // audience: `urn:auth0-authz-api`,
        // audience: `https://madcollective.api.com/test/`,
        audience: `https://${domain}/api/v2/`,
        scope: "update:current_user_metadata",
      })
      // console.log(accessToken)
      console.log(user)
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`
      
      const metadataResponse = await fetch(userDetailsByIdUrl, {
        method: 'PATCH',
        body: JSON.stringify({
          user_metadata: {
            "picturewre": picUrl
          }
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json'
        }
      })
      console.log("metadataResponse=")
      console.log(metadataResponse)
      // const { user_metadata } = await metadataResponse.json()

      // setUserMetadata(user_metadata)
    } catch (e) {
      console.log(e.message)
    }
  }
 
  // const updatePic = () =>{
  //   const localStorageRef = localStorage.getItem('accessToken')
  //   console.log("in method")
  //   console.log(localStorageRef)
  //   const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`
  //   fetch(userDetailsByIdUrl, {
  //     method: 'PATCH',
  //     body: {
  //       user_metadata: {
  //         picturewre: picUrl
  //       }
  //     },
  //     headers: {
  //       Authorization: `Bearer ${localStorageRef}`,
  //       'content-type': 'application/json'
  //     }
      
  //   }).catch(err=>console.log(err))
  // }
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
