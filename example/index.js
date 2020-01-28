import React from 'react';
import ReactDOM from 'react-dom';
import OAuth2Login from '../src/OAuth2Login';
import {
  authorizationUrl,
  clientId,
  redirectUri
} from './settings';

const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);

ReactDOM.render(
  <OAuth2Login
    authorizationUrl={authorizationUrl}
    clientId={clientId}
    redirectUri={redirectUri}
    buttonText="Login with this or that"
    onSuccess={onSuccess}
    onFailure={onFailure}
  />,
  document.getElementById('example')
);
