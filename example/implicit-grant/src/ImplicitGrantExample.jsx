/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';

// import OAuth2Login from 'react-simple-oauth2-login';
import OAuth2Login from '../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import { authorizationUrl, clientId, redirectUri, scope } from './settings';

export default function ImplicitGrantExample() {
  // don't pass the scope as component prop unless it's actually defined and non-empty
  const extraProps = scope ? { scope } : {};

  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  const onSuccess = ({ access_token: token }) => setAccessToken(token);
  return (
    <div>
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
        onSuccess={onSuccess}
        onFailure={setError}
        // buttonText & id are optional
        // (id is used for end-to-end testing)
        buttonText="Implicit grant login"
        id="implicit-grant-component-btn"
      />
      {accessToken && (
        <p>
          Access token:{' '}
          <span id="implicit-grant-component-token">{accessToken}</span>
        </p>
      )}
    </div>
  );
}
