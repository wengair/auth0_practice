import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"


function DetailProfile() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [userMetadata, setUserMetadata] = useState(null)
  console.log('user =')
  console.log(user)
  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = process.env.DOMAIN
  
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user update:current_user_metadata read:users",
        })
        console.log('in detail profile token=')
        console.log(accessToken)
        localStorage.setItem('accessToken', accessToken)
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`
  
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const { user_metadata } = await metadataResponse.json()
  
        setUserMetadata(user_metadata)

      } catch (e) {
        console.log(e.message)
      }
    }
  
    getUserMetadata()
  }, [user])

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} style={{width:'200px'}}/>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <h3>User Metadata</h3>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}
          {console.log("userMetadata=")}
          {console.log(userMetadata)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </div>
    )
  )
}

export default DetailProfile
