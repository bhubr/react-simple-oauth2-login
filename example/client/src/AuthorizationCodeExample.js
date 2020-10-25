import React, { useState } from 'react';
import OAuth2Login from '../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import {
  authorizationUrl,
  clientId,
  redirectUri,
} from './settings-code';

export default function AuthorizationCodeExample() {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  const onSuccess = ({ code }) => fetch(`http://localhost:5000/github/token?code=${code}`)
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
