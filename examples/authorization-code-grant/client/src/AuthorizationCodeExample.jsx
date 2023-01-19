/* eslint-disable react/jsx-props-no-spreading */
import { useMemo, useState } from 'react';

// import OAuth2Login from 'react-simple-oauth2-login';
import OAuth2Login from '../../../../src/OAuth2Login';
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

export default function AuthorizationCodeExample() {
  // don't pass the scope as component prop unless it's actually defined and non-empty
  const extraProps = scope ? { scope } : {};

  const [accessToken, setAccessToken] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // You can test this with a GitHub OAuth 2 app (provided test server supports GitHub, Spotify & more)
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
        responseType="code"
        onSuccess={onSuccess}
        onFailure={setError}
        // buttonText & id are optional
        // (id is used for end-to-end testing)
        buttonText="Auth code login"
        id="authorization-code-component-btn"
      />
      {accessToken && (
        <p>
          Access token:{' '}
          <span id="authorization-code-component-token">{accessToken}</span>
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
