/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import OAuth2Login from '../../../src/OAuth2Login';
import {
  authorizationUrl,
  clientId,
  redirectUri,
} from './settings';

const onSuccess = ({ code }) => fetch(`http://localhost:5000/spotify/token?code=${code}`)
  .then(res => res.json())
  .then(data => console.log('received data', data));

const onFailure = response => console.error(response);

ReactDOM.render(
  <OAuth2Login
    authorizationUrl={authorizationUrl}
    clientId={clientId}
    redirectUri={redirectUri}
    responseType="code"
    buttonText="Login with this or that"
    onSuccess={onSuccess}
    onFailure={onFailure}
  />,
  document.getElementById('example'),
);
