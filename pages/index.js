import LoginButton from '../clients/components/LoginButton'
import LogoutButton from '../clients/components/LogoutButton'
import Profile from '../clients/components/Profile'
import Link from 'next/link'
import { withAuthenticationRequired } from "@auth0/auth0-react"

export default function Home() {
  
  return (
  <div>
    <LoginButton />
    <LogoutButton />
    <Profile />
    <Link href="/update"><a>Update Pic</a></Link>
  </div>
  )
}

// export default withAuthenticationRequired(index, {
//   onRedirecting: () => <Loading />,
// });