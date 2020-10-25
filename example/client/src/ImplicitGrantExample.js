import React, { useState } from 'react';
import OAuth2Login from '../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import {
  authorizationUrl,
  clientId,
  redirectUri,
} from './settings-implicit';

export default function ImplicitGrantExample() {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  const onSuccess = ({ access_token: token }) => setAccessToken(token);
  return (
    <div className="column">
      {
        error && <ErrorAlert error={error} />
      }
      <OAuth2Login
        authorizationUrl={authorizationUrl}
        clientId={clientId}
        redirectUri={redirectUri}
        responseType="token"
        buttonText="Implicit grant login"
        onSuccess={onSuccess}
        onFailure={setError}
      />
      {
        accessToken && <p>Access token: {accessToken}</p>
      }
    </div>
  );
}
