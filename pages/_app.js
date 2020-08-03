import React from 'react'
import { Auth0Provider } from "@auth0/auth0-react"
// import Router from 'next/router'

// const onRedirectCallback = (appState) => {
//   // Use Next.js's Router.replace method to replace the url
//   Router.replace(appState?.returnTo || '/')
// }

function App({ Component, pageProps }) {
  return (
    <Auth0Provider
    domain="madcollective.us.auth0.com"
    clientId="rj74oNLJkmT4lBTpaJUOpRvTmqMeMaYP"
    redirectUri='http://127.0.0.1:3000' // orignial is window.location.origin / process.browser.origin / router.pathname
    audience="https://madcollective.us.auth0.com/api/v2/"
    // audience="https://madcollective.api.com/test/"
    // audience="urn:auth0-authz-api"
    scope="read:current_user update:current_user read:users offline_access"
    // onRedirectCallback={onRedirectCallback}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  )
}


export default App