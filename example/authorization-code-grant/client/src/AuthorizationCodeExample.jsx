import { useMemo, useState } from 'react';
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

  return (
    <div className="column">
      {error && <ErrorAlert error={error} />}
      <OAuth2Login
        id="auth-code-login-btn"
        authorizationUrl={authorizationUrl}
        clientId={clientId}
        redirectUri={redirectUri}
        responseType="code"
        scope={scope}
        buttonText="Auth code login"
        onSuccess={onSuccess}
        onFailure={setError}
      />
      {accessToken && <p>Access token: {accessToken}</p>}
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
