import React, { useState } from 'react';
import OAuth2Login from '../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import {
  authorizationUrl,
  clientId,
  redirectUri,
  serverUrl
} from './settings-code';

export default function AuthorizationCodeExample() {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  // You can test this with a GitHub OAuth2 app (provided test server supports GitHub and Spotify)
  const onSuccess = ({ code }) => fetch(`${serverUrl}/github/token?code=${code}`)
    .then(res => res.json())
    .then(data => setAccessToken(data.access_token));

  return (
    <div className="column">
      {
        error && <ErrorAlert error={error} />
      }
      <OAuth2Login
        authorizationUrl={authorizationUrl}
        clientId={clientId}
        redirectUri={redirectUri}
        responseType="code"
        buttonText="Auth code login"
        onSuccess={onSuccess}
        onFailure={setError}
      />
      {
        accessToken && <p>Access token: {accessToken}</p>
      }
    </div>
  );
}
