/* eslint-disable react/jsx-props-no-spreading */
import { useMemo, useState } from 'react';

// import OAuth2Login from 'react-simple-oauth2-login';
import OAuth2Login from '../../../../src/OAuth2Login';
import ErrorAlert from './ErrorAlert';
import ThemedJSONTree from './ThemedJSONTree';
import {
  authorizationUrl,
  clientId,
  redirectUri,
  appServerUrl,
  resourceServerUrl,
  resourcePathname,
  scope,
} from './settings';
import { fetchResource, requestAccessToken } from './fetch-helpers';
import MissingParamsAlert from './MissingParamsAlert';

const tokenUrl = `${appServerUrl}/github/token`;
const resourceUrl = `${resourceServerUrl}${resourcePathname}`;

export default function AuthorizationCodeExample() {
  // don't pass the scope as component prop unless it's actually defined and non-empty
  const extraProps = scope ? { scope } : {};

  const [accessToken, setAccessToken] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Called when the authorization step succeeds
  // (i.e. we are redirected to the callback URI with auth code in the URL)
  const onSuccess = async ({ code }) => {
    try {
      // Send auth code to our server to get an access token in exchange
      const { access_token: token } = await requestAccessToken(tokenUrl, code);
      // Store it for later use
      setAccessToken(token);
      const resBody = await fetchResource(resourceUrl, token);
      setData(resBody);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      {/* In case some required parameters are missing */}
      {(!authorizationUrl || !clientId || !redirectUri) && (
        <MissingParamsAlert />
      )}
      {error && <ErrorAlert error={error} />}
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
          <ThemedJSONTree data={data} />
        </div>
      )}
    </div>
  );
}
