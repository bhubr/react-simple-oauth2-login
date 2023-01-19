/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';

// import { useOAuth2Login } from 'react-simple-oauth2-login';
import useOAuth2Login from '../../../src/useOAuth2Login';
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

export default function ImplicitGrantHeadless() {
  const extraParams = scope ? { scope } : {};

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
      <button id="implicit-grant-headless-btn" type="button" onClick={activate}>
        Implicit grant login (headless mode)
      </button>
      {accessToken && (
        <p>
          Access token:{' '}
          <span id="implicit-grant-headless-token">{accessToken}</span>
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
