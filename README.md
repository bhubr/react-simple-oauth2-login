# React GitHub Login

![NPM](https://img.shields.io/npm/v/react-github-login.svg?style=flat)
![CircleCI](https://circleci.com/gh/checkr/react-github-login.svg?style=shield&circle-token=493b950057f69e68ac8698a9ee189b2132a296e4)

React component for [GitHub login](https://developer.github.com/v3/oauth/).

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import OAuth2Login from 'react-simple-oauth2-login';

const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);

ReactDOM.render(
  <OAuth2Login
    authorizationUrl="https://accounts.spotify.com/authorize"
    clientId="9822046hvr4lnhi7g07grihpefahy5jb"
    redirectUri="http://localhost:3000/oauth-callback"
    responseType="token"
    onSuccess={onSuccess}
    onFailure={onFailure}/>,
  document.getElementById('root')
);
```

### Props

#### `authorizationUrl`

`{string}` _required_

Base URL of the provider's authorization screen.

#### `clientId`

`{string}` _required_

Client ID for OAuth application.

#### `redirectUri`

`{string}` _required_

Registered redirect URI for OAuth application.

#### `responseType`

`{string}` _required_

Determines the type of OAuth2 flow. Two possible values:

* `code`: Authorization Code flow. You need a server-side app to use this.
* `token`: Implicit Grant flow.

#### `scope`

`{string}`

Scope for OAuth application. Example: `user:email` (GitHub).

#### `className`

`{string}`

CSS class for the login button.

#### `buttonText`

`{string}`

Text content for the login button.

#### `onRequest`

`{function}`

Callback for every request.

#### `onSuccess`

`{function}`

Callback for successful login. An object will be passed as an argument to the callback, e.g. `{ "code": "..." }`.

#### `onFailure`

`{function}`

Callback for errors raised during login.


## Development

```sh
$ npm start
```

Webpack development server starts at [http://localhost:8080](http://localhost:8080), loading [example/index.html](github.com/checkr/react-facebook-login/tree/master/example/index.html).
