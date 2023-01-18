/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';

import OAuth2Login from '../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import { authorizationUrl, clientId, redirectUri, scope } from './settings';

export default function ImplicitGrantExample() {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  const extraProps = scope ? { scope } : {};

  const onSuccess = ({ access_token: token }) => setAccessToken(token);
  return (
    <div className="column">
      {error && <ErrorAlert error={error} />}
      {(!authorizationUrl || !clientId || !redirectUri) && (
        <ErrorAlert
          error={{
            message:
              'Missing at least one of `authorizationUrl`, `clientId`, `redirectUri`',
          }}
        />
      )}
      <OAuth2Login
        {...extraProps}
        authorizationUrl={authorizationUrl}
        clientId={clientId}
        redirectUri={redirectUri}
        responseType="token"
        buttonText="Implicit grant login"
        onSuccess={onSuccess}
        onFailure={setError}
      />
      {accessToken && <p>Access token: {accessToken}</p>}
    </div>
  );
}
