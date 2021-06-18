import React, { useState } from 'react';
import OAuth2Login from '../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import {
  authorizationUrl,
  clientId,
  redirectUri,
  appServerUrl,
  oauthServerUrl,
  scope,
} from './settings-code';

export default function AuthorizationCodeExample() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // You can test this with a GitHub OAuth2 app (provided test server supports GitHub and Spotify)
  const onSuccess = ({ code }) => fetch(`${appServerUrl}/github/token`, {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((data) => {
      setAccessToken(data.access_token);
      return data.access_token;
    })
    .then(token => fetch(`${oauthServerUrl}/api/user`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
      },
    }))
    .then(res => res.json())
    .then(setUser)
    .catch(setError);

  return (
    <div className="column">
      {
        error && <ErrorAlert error={error} />
      }
      <OAuth2Login
        id="auth-code-login-btn"
        authorizationUrl={authorizationUrl}
        clientId={clientId}
        redirectUri={redirectUri}
        responseType="code"
        scope={scope}
        buttonText="Auth code login"
        onSuccess={onSuccess}
        onFailure={setError}
      />
      {
        accessToken && <p>Access token: {accessToken}</p>
      }
      {
        user && (
          <div>
            <h3>User data</h3>
            <p>Obtained from token-protected API</p>
            <p>{user.name} {user.email}</p>
            <img src={user.picture} alt={user.name} />
          </div>
        )
      }
    </div>
  );
}
