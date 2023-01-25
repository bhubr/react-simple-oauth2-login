/* eslint-disable react/jsx-props-no-spreading */
import { useMemo, useState } from 'react';

// import {useOAuth2Login} from 'react-simple-oauth2-login';
import useOAuth2Login from '../../../../src/useOAuth2Login';
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

export default function AuthorizationCodeHeadless() {
  const extraParams = scope ? { scope } : {};

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
      {/* In case some required parameters are missing */}
      {(!authorizationUrl || !clientId || !redirectUri) && (
        <MissingParamsAlert />
      )}
      {error && <ErrorAlert error={error} />}
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
          <ThemedJSONTree data={data} />
        </div>
      )}
    </div>
  );
}
