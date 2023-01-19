/* eslint-disable react/jsx-props-no-spreading */
import { useMemo, useState } from 'react';

// import OAuth2Login from 'react-simple-oauth2-login';
import OAuth2Login from '../../../../src/OAuth2Login';
import useOAuth2Login from '../../../../src/useOAuth2Login';
import ErrorAlert from './ErrorAlert';
import {
  authorizationUrl,
  clientId,
  redirectUri,
  appServerUrl,
  resourceServerUrl,
  resourcePathname,
  scope,
} from './settings';

function PreviewJSON({ data }) {
  const formattedData = useMemo(() => JSON.stringify(data, null, 2), []);
  return (
    <pre>
      <code>{formattedData}</code>
    </pre>
  );
}

export default function AuthorizationCodeHeadless() {
  const extraParams = scope ? { scope } : {};

  const [accessToken, setAccessToken] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // You can test this with a GitHub OAuth2 app (provided test server supports GitHub and Spotify)
  const onSuccess = ({ code }) =>
    fetch(`${appServerUrl}/github/token`, {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.access_token);
        return data.access_token;
      })
      .then((token) =>
        fetch(`${resourceServerUrl}${resourcePathname}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`,
          },
        })
      )
      .then((res) => res.json())
      .then(setData)
      .catch(setError);

  const { activate } = useOAuth2Login({
    ...extraParams,
    responseType: 'code',
    authorizationUrl,
    clientId,
    redirectUri,
    onSuccess,
    onFailure: setError,
  });

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
      <button
        id="authorization-code-headless-btn"
        type="button"
        onClick={activate}
      >
        Auth code login (headless mode)
      </button>
      {accessToken && (
        <p>
          Access token:{' '}
          <span id="authorization-code-headless-token">{accessToken}</span>
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
