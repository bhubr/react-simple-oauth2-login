/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';

// import OAuth2Login from 'react-simple-oauth2-login';
import OAuth2Login from '../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import {
  authorizationUrl,
  clientId,
  redirectUri,
  scope,
  resourceServerUrl,
  resourcePathname,
} from './settings';

function PreviewJSON({ data }) {
  const formattedData = useMemo(() => JSON.stringify(data, null, 2), []);
  return (
    <pre>
      <code>{formattedData}</code>
    </pre>
  );
}

export default function ImplicitGrantExample() {
  // don't pass the scope as component prop unless it's actually defined and non-empty
  const extraProps = scope ? { scope } : {};

  const [accessToken, setAccessToken] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const onSuccess = ({ access_token: token }) => {
    setAccessToken(token);
    fetch(`${resourceServerUrl}${resourcePathname}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setData)
      .catch(setError);
  };

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
      {data && (
        <div>
          <h3>Retrieved data</h3>
          <p>Obtained from token-protected API</p>
          <PreviewJSON data={data} />
        </div>
      )}
    </div>
  );
}
