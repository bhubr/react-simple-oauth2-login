/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';

// import { useOAuth2Login } from 'react-simple-oauth2-login';
import useOAuth2Login from '../../../src/useOAuth2Login';
import ErrorAlert from './ErrorAlert';
import { authorizationUrl, clientId, redirectUri, scope } from './settings';

export default function ImplicitGrantHeadless() {
  const extraParams = scope ? { scope } : {};

  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  const onSuccess = ({ access_token: token }) => setAccessToken(token);

  const { activate } = useOAuth2Login({
    ...extraParams,
    responseType: 'token',
    authorizationUrl,
    clientId,
    redirectUri,
    onSuccess,
    onFailure: setError,
  });

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
      <button type="button" onClick={activate}>
        Implicit grant login (headless mode)
      </button>
      {accessToken && <p>Access token: {accessToken}</p>}
    </div>
  );
}
