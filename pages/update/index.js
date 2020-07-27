import React from 'react'
import DetailProfile from '../../components/DetailProfile'
import UpdateProfilePic from '../../components/UpdateProfilePic'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import Loading from "../../components/Loading";

function index() {
  return (
    <div>
      <DetailProfile />
      <UpdateProfilePic />
    </div>
  )
}

// export default withAuthenticationRequired(index, {
//   onRedirecting: () => <Loading />,
// });
export default index