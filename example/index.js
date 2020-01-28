import React from 'react';
import ReactDOM from 'react-dom';
import OAuth2Login from '../src/OAuth2Login';

const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);

ReactDOM.render(
  <OAuth2Login
    authorizeUrl=""
    clientId=""
    redirectUri=""
    onSuccess={onSuccess}
    onFailure={onFailure}
  />,
  document.getElementById('example')
);
