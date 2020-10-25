# React Simple OAuth2 Login

> :trophy: **Credits**: this component is based on [React GitHub Login](https://github.com/checkr/react-github-login) by [Checkr](https://checkr.com/).

Simple React component for OAuth2 login.

Supports **Authorization Code** and **Implicit Grant** flows.

## RTFM

* [Usage](#usage)

    * [Basic example](#basic-example)
    * [Example app](#example-app)
    * [Props](#props)
* [ChangeLog](#changelog)

## Usage

### Basic example

The component displays as a simple button. Clicking it will open the authorization screen for your chosen provider, in a popup (thus avoiding losing your app's state).

**Four props** are mandatory: `authorizationUrl`, `responseType`, `clientId`, `redirectUri`.

The client ID is given by the OAuth2 provider (usually along with a client secret) when you set up an OAuth2 app (where you're asked to fill in the Redirect URI).

```js
import React from 'react';
import ReactDOM from 'react-dom';
import OAuth2Login from 'react-simple-oauth2-login';

const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);

ReactDOM.render(
  <OAuth2Login
    authorizationUrl="https://accounts.spotify.com/authorize"
    responseType="token"
    clientId="9822046hvr4lnhi7g07grihpefahy5jb"
    redirectUri="http://localhost:3000/oauth-callback"
    onSuccess={onSuccess}
    onFailure={onFailure}/>,
  document.getElementById('root')
);
```

### Example app

Check out the examples in the `example` directory. You'll need OAuth2 apps configured on whatever provider.

#### Client app

Setup:

* `cd example/client`
* `npm install`
* Copy `settings.sample.js` as `settings-code.js` and/or `settings-implicit.js`, depending on which flow you intend to test.
* `npm start` (uses Parcel)

The `client` app provides examples for both flows. If you look at the two components, what really distinguishes how they use the component is:

* The value of `responseType` prop,
* The `fetch` call to send the code to the server in the Authorization Code example.

#### Server app

The `server` app is only given as an example to test the **Authorization Code flow**. It currently supports getting access tokens from GitHub or Spotify. In a real-world app, you'll probably want to use [Passport](http://www.passportjs.org/).

**Right after** you run `npm install`, you need to copy `.env.sample` as `.env`, and modify the values according to your needs.

* `OAUTH_TOKEN_URL` is the URL where you should POST the code obtained from the authorization screen,
* `OAUTH_CLIENT_ID` is the OAuth2 Client ID,
* `OAUTH_CLIENT_SECRET` is the OAuth2 Client Secret,
* `OAUTH_REDIRECT_URI` is the OAuth2 Redirect URI (thanks Captain Obvious).

The Client ID and Redirect URI should match that of the client app.

Then you can run `npm start`.

### Props

#### `authorizationUrl`

`{string}` _required_

Base URL of the provider's authorization screen.

#### `responseType`

`{string}` _required_

Determines the type of OAuth2 flow. Two possible values:

* `code`: Authorization Code flow. You need a server-side app to use this.
* `token`: Implicit Grant flow.

#### `clientId`

`{string}` _required_

Client ID for OAuth application.

#### `redirectUri`

`{string}` _required_

Registered redirect URI for OAuth application.

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

## ChangeLog

* v0.2.0 (October 25th, 2020):

    * Add support for Implicit Grant flow
    * Improve error handling
    * Provide better example app (with a sample server-side app)
    * Try and provide a decent Readme
* v0.1.x (January to September 2020th):

    * Spin the project off from React GitHub Login
    * Make it support various OAuth2 providers, only for Authorization Code flow
