import React,{useEffect} from 'react'
import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from 'next/router'


function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <Auth0Provider
    domain="madcollective.us.auth0.com"
    clientId="rj74oNLJkmT4lBTpaJUOpRvTmqMeMaYP"
    redirectUri='http://127.0.0.1:3000' // orignial is window.location.origin / process.browser.origin / router.pathname
    // audience="https://madcollective.us.auth0.com/api/v2/"
    audience="https://madcollective.api.com/test/"
    scope="read:current_user update:current_user_metadata read:clients"
    >
      <Component {...pageProps} />
    </Auth0Provider>
  )
}


export default App