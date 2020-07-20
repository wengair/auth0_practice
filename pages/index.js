import LoginButton from '../components/LoginButton'
import LogoutButton from '../components/LogoutButton'
import Profile from '../components/Profile'
import Link from 'next/link'

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
