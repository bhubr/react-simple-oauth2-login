import React, { useState } from 'react';
import OAuth2Login from '../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import {
  authorizationUrl,
  tokenUrl,
  clientId,
  redirectUri,
} from './settings-pkce';

export default function PKCEExample() {
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
        tokenUrl={tokenUrl}
        clientId={clientId}
        redirectUri={redirectUri}
        responseType="code"
        buttonText="Auth code w/PKCE login"
        onSuccess={(data) => console.log(data) || onSuccess(data)}
        onFailure={(err) => console.error(err) || setError(err)}
      />
      {
        accessToken && (
        <p>
          Access token:
          {accessToken}
        </p>
        )
      }
    </div>
  );
}
