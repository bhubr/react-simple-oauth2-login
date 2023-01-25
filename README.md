# React Simple OAuth2 Login
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

> :trophy: **Credits**: this component is based on [React GitHub Login](https://github.com/checkr/react-github-login) by [Checkr](https://checkr.com/).

Simple React component for OAuth2 login.

Supports **Authorization Code** and **Implicit Grant** flows.

## RTFM

* [Contributors welcome](#contributors-welcome)
* [Features](#features)
* [Usage](#usage)

    * [Basic example](#basic-example)
    * [Example apps](#example-apps)
    * [Props](#props)
* [ChangeLog](#changelog)

## Contributors welcome!

If you have ideas, feature requests, knowledge of how to implement OAuth 2 flows in real-world apps, and/or JavaScript/TypeScript coding skills, your contribution is more than welcome!

Please let me know by opening a [discussion](https://github.com/bhubr/react-simple-oauth2-login/discussions) or an [issue](https://github.com/bhubr/react-simple-oauth2-login/issues) on the GitHub repo.

## Features

This package supports two OAuth 2.0 flows:

* Implicit grant (not recommended)
* Authorization Code grant

More will come soon: after a long hiatus, work on this package has resumed in January, 2023. Upcoming features include TypeScript support and PKCE support.

## Usage

### Basic example

The component displays as a simple button. Clicking it will open the authorization screen for your chosen provider, in a popup (thus avoiding losing your app's state).

**Four "setting" props** are mandatory: `authorizationUrl`, `responseType`, `clientId`, `redirectUri`. The `scope` might be required, depending on your OAuth 2 provider and which resources you want to access.

In addition, **two callback props** are required: `onSuccess` and `onFailure`.

The client ID is given by the OAuth2 provider (along with a client secret) when you set up an OAuth2 app (where you're asked to provide at least a Redirect URI).

For the sake of simplicity, the code samples below demonstrate the use of the "Implicit Grant" flow (which is **not recommended**).

#### 1. Using the `OAuth2Login` component

```jsx
// Assuming you're using React 18
import React from "react";
import ReactDOM from "react-dom/client";
import OAuth2Login from "react-simple-oauth2-login";

const onSuccess = (response) => console.log(response);
const onFailure = (response) => console.error(response);

ReactDOM.createRoot(document.getElementById("root")).render(
  <OAuth2Login
    authorizationUrl="https://accounts.spotify.com/authorize"
    responseType="token"
    clientId="9822046hvr4lnhi7g07grihpefahy5jb"
    redirectUri="http://localhost:5173/oauth/callback"
    onSuccess={onSuccess}
    onFailure={onFailure}
  />,
  document.getElementById("root")
);
```

#### 2. Using the `useOAuth2Login` hook

From v0.6.0, you can use the `useOAuth2Login` hook instead of the component. The "props" are simply passed as an object to the hook.

```jsx
// Assuming you're using React 18
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useOAuth2Login } from 'react-simple-oauth2-login';

const onSuccess = (response) => console.log(response);
const onFailure = (response) => console.error(response);

const App = () => {
  const { activate } = useOAuth2Login({
    authorizationUrl: 'https://accounts.spotify.com/authorize',
    responseType: 'token',
    clientId: '8671ba9591894766bfcb0c15ce04ff4e',
    redirectUri: 'http://localhost:5173/oauth/callback',
    onSuccess,
    onFailure,
  });

  return (
    <button type="button" onClick={activate}>
      OAuth 2 Login
    </button>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />,
  document.getElementById('root')
);
```

### Example apps

> :warning: Please read carefully!
>
> * The example apps all use the [Yarn](https://yarnpkg.com/) package manager. **Install it first**, using `npm i -g yarn`.
> * As of v0.6.0, for demo purposes, you can now run the examples "out of the box", without configuration, by using the "test OAuth2 server" (see below)&hellip;
> * **However**, you'll need to carry out some setup to use the examples with **your chosen OAuth 2 provider**. Namely, **you'll need to create `.env.local` files** in the directories of the examples you're using.
> * As of now, examples support one OAuth 2 provider at a time (you'll have to invest extra work if you want your app to handle multiple providers).
> * The way we demonstrate Auth Code flow in the examples isn't the only possible approach. I'll try to devote some time to investigating better practices. Again, if you have some experience on the topic, please let me know!

Check out the examples in the `examples` directory. As of now, there are two:

* `examples/implicit-grant` &rarr; demonstrates the Implicit Grant flow &mdash React app only.
* `examples/authorization-code-grant` &rarr; demonstrates the Authorization Code flow &mdash; includes:

    * a React app in the `client` subdirectory.
    * a Node.js/Express app in the `server` subdirectory.

#### Test OAuth 2 Server

> :information_source: Needed **only** if you want to run the examples without adapting them to your OAuth 2.0 provider.

Setup:

* `cd examples/test-oauth2-server`
* `yarn` &rarr; installs dependencies
* `yarn start` &rarr; starts the server (should display `listening on 4000` when up)

#### OAuth 2 app creation

Any OAuth 2 provider will allow you to create OAuth 2 apps.

E.g. on GitHub, you might head to [OAuth Apps](https://github.com/settings/developers) and click "New OAuth App".

In your app's settings, set the "redirect URI" to:

* `http://localhost:5173/oauth/callback` for the Implicit grant example,
* `http://localhost:5174/oauth/callback` for the Authorization Code grant example,

#### Implicit Grant example

> Out of the box, this app runs on <http://localhost:5173>.

Setup:

* `cd examples/implicit-grant`
* `yarn`
* **Unless you're using the Test OAuth 2 Server**, you need to override the settings provided in `.env`, by creating a `.env.local` file.

    * copy `.env` as `.env.local` and adapt to your needs.
    * Change `VITE_OAUTH2_AUTHORIZATION_URL` to your provider's authorization screen URL.
    * Change `VITE_OAUTH2_CLIENT_ID` to the client ID assigned to your app by your provider.
    * Change `VITE_OAUTH2_SCOPE` to the scope(s) you need to provide to your access token (e.g. `playlist-read-private` for Spotify).
    * Change `VITE_RESOURCE_SERVER_URL` to the origin of the server hosting resources (e.g. `https://api.spotify.com`)
    * Change `VITE_RESOURCE_PATHNAME` to a resource endpoint, relative to the previous setting (e.g. `/v1/me/playlists`)

* `yarn dev` &rarr; starts the Vite dev server.

#### Authorization Code example

##### Client app

> Out of the box, this app runs on <http://localhost:5174>.

Setup is the same as for the Implicit Grant example, except:

* The app is located under `examples/authorization-code-grant/client`,
* In the `.env(.local)` file, there's an additional parameter, `VITE_APP_SERVER_URL`, pointing to your server which sends the auth code to the OAuth 2 provider, in order to get an access token.

This app itself is very similar to the Implicit Grant example. What changes is:

* The value of `responseType` prop,
* The `fetch` call to send the code to the server.

##### Server app

The `server` app is given as an example to test the **Authorization Code flow**. It currently supports getting access tokens from GitHub or Spotify, but probably many others. The only difference is that Spotify requires the client ID & secret to be sent in a header, while GitHub expects them in the request body.

In a real-world app, if your backend is based on Node.js, you might want to use [Passport](http://www.passportjs.org/).

After you run `yarn`, you need to copy `.env` as `.env.local`, and modify the values according to your needs.

* `OAUTH_TOKEN_URL` is the URL where you should POST the code obtained from the authorization screen,
* `OAUTH_CLIENT_ID` is the OAuth2 Client ID,
* `OAUTH_CLIENT_SECRET` is the OAuth2 Client Secret,
* `OAUTH_REDIRECT_URI` is the OAuth2 Redirect URI (thanks Captain Obvious!).

The Client ID and Redirect URI should match that of the client app.

Then you can run `yarn dev` or `yarn start`.

### Cross Origin / Same-origin Policy

> See the documentation on [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)

If you are using the Authorization Code flow, and your redirect URL is on a server with a different
domain to your frontend, you will need to do the following:

1. Set the `isCrossOrigin` property to `true`
2. Set up your authorization url on your server to return a standard response similar to the one
   below:

```
<html>
<head></head>
<body>
  <script>
    window.addEventListener("message", function (event) {
      if (event.data.message === "requestResult") {
        event.source.postMessage({"message": "deliverResult", result: {...} }, "*");
      }
    });
  </script>
</body>
</html>
```

Your server needs to populate the `result` key with an object to deliver back to the frontend.

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

#### `popupWidth`

`{number}`

Width for the popup window upon clicking the button in px. Default: `680`.

#### `popupHeight`

`{number}`

Height for the popup window upon clicking the button in px. Default: `680`.

#### `className`

`{string}`

CSS class for the login button.

#### `buttonText`

`{string}`

Text content for the login button.

#### `isCrossOrigin`

`{bool}`

Is this a cross-origin request? If you are implementing an Authorization Code workflow and your
server backend is on a different URL, you'll need to set this to true.

#### `extraParams`

`{object}`

This allows you to pass extra query parameters to the OAuth2 login screen. Some providers allow additional parameters. See [issue #39 on the repo](https://github.com/bhubr/react-simple-oauth2-login/issues/39) for more details. If you want to add `prompt=consent` to the query string, you need to pass `extraParams={{ prompt: 'consent' }}` as a prop.

#### `render`

`{function}`

A custom rendering function. An object containing properties for rendering will be passed in as an
argument, e.g. `{buttonText: "...", children: [...], className: "...", onClick: func}`.

#### `onRequest`

`{function}`

Callback for every request.

#### `onSuccess`

`{function}`

Callback for successful login. An object, containing the data extracted from the redirect URI, will be passed as an argument to the callback. Its content will vary depending on the auth flow you've specified via `responseType`.

Example response payload for the Implicit Grant flow:

```json
{
  "access_token": "BQCgzzEDhWZiIO6Y0a6aQjh6dGg6mMPwktuc0QWAm4eyv4oyfG45_Dm8ugqAp-c8n8uEi21XnIvy26Sk9h3faU_GKxWgQPEz59vcm2RCcndiM6bfyP-8hzD08uzMw4WEuKc56rcNVXP8P5XYgdn7fPDKMutAWyQOOtIdxom0vrWY",
  "token_type": "Bearer",
  "expires_in": "3600"
}
```

Example response payload for the Authorization Code Grant flow:

```json
{
  "code": "9421c4946b599e152a47"
}
```

#### `onFailure`

`{function}`

Callback for errors raised during login.

## ChangeLog

* v0.6.0 (published January 19th, 2023)

    * **New feature** : "headless" mode &rarr; provide a hook in order to give users more control. Again, shout out to [jshthornton](https://github.com/jshthornton) who implemented this feature.
    * **Deprecation notice**: since the headless mode relies on hooks, the minimal version of React is 16.8.
    * Provide distinct Implicit Grant & Authorization Code examples.
    * Full end-to-end testing with WebDriverIO.
    * Fixes:

        * prevent `scope=undefined` to be passed in the URL, if `scope` is not provided.
        * URI-encode `redirectUri` prop.

    * Internal/tooling:

        * Use yarn instead of NPM.
        * Use vite instead of parcel for examples.
        * Update dev dependencies: Jest, WebDriverIO.
        * Rewrite test OAuth2 server.

* v0.5.4 (published November 14th, 2022)

    * Update `react` peer dependency, so as to support React 18. Thanks to [alxnik](https://github.com/alxnik) and [desoss](https://github.com/desoss) for reporting.

* v0.5.3 (published November 12th, 2021)

    * Fix accidental replacement of NPM registry URL by a local registry's URL.

* v0.5.2 (published November 11th, 2021)

    * Update `react` peer dependency, so as to support React 17. Thanks to [arudrakalyan](https://github.com/arudrakalyan) for reporting.

* v0.5.1 (published August 25th, 2021)

    * Allow to pass extra params in the query string, via the `extraParams` prop. Thanks to [jshthornton](https://github.com/jshthornton).

* v0.5.0 (published June 18th, 2021)

    * Increase default popup's height. Thanks to [tennox](https://github.com/tennox)
    * Provide optional `popupWidth` and `popupHeight` props to override the defaults. Thanks to [Coow](https://github.com/Coow)

* v0.4.0 (published June 18th, 2021)

    * **Support cross-origin auth flow**: previous versions worked only if the redirect URI was derived from the frontend app's URL; now you can have a redirect URI poiting to your backend app. Thanks (again) to [rsnyman](https://github.com/rsnyman).
    * Update dev dependencies: ESLint, Enzyme
    * Restore unit tests to working state
    * End-to-end testing of Authorization Code flow (using a Node-based OAuth2 server)
* v0.3.0 (Changes made in May, 2021 - published June 18th, 2021) - thanks to [rsnyman](https://github.com/rsnyman) for both additions:

    * Add `render` prop to customize the login button's appearance
    * Add MIT license
* v0.2.0 (October 25th, 2020):

    * Add support for Implicit Grant flow
    * Improve error handling
    * Provide better example app (with a sample server-side app)
    * Try and provide a decent Readme
* v0.1.x (January to September 2020th):

    * Spin the project off from React GitHub Login
    * Make it support various OAuth2 providers, only for Authorization Code flow

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://developpeur-web-toulouse.fr/"><img src="https://avatars.githubusercontent.com/u/15270070?v=4?s=100" width="100px;" alt="Benoît Hubert"/><br /><sub><b>Benoît Hubert</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=bhubr" title="Code">💻</a> <a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=bhubr" title="Documentation">📖</a> <a href="#example-bhubr" title="Examples">💡</a> <a href="#maintenance-bhubr" title="Maintenance">🚧</a> <a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=bhubr" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rsnyman"><img src="https://avatars.githubusercontent.com/u/1080682?v=4?s=100" width="100px;" alt="Raoul Snyman"/><br /><sub><b>Raoul Snyman</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=rsnyman" title="Code">💻</a> <a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=rsnyman" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Coow"><img src="https://avatars.githubusercontent.com/u/16673606?v=4?s=100" width="100px;" alt="Coow"/><br /><sub><b>Coow</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=Coow" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tennox"><img src="https://avatars.githubusercontent.com/u/2084639?v=4?s=100" width="100px;" alt="Manuel"/><br /><sub><b>Manuel</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/issues?q=author%3Atennox" title="Bug reports">🐛</a> <a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=tennox" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://stewartjpark.com"><img src="https://avatars.githubusercontent.com/u/388348?v=4?s=100" width="100px;" alt="Stewart Park"/><br /><sub><b>Stewart Park</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=stewartpark" title="Code">💻</a> <a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=stewartpark" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://juresotosek.com"><img src="https://avatars.githubusercontent.com/u/16746406?v=4?s=100" width="100px;" alt="Jure Sotosek"/><br /><sub><b>Jure Sotosek</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=JureSotosek" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jshthornton"><img src="https://avatars.githubusercontent.com/u/2814746?v=4?s=100" width="100px;" alt="Joshua Thornton"/><br /><sub><b>Joshua Thornton</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/commits?author=jshthornton" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/arudrakalyan"><img src="https://avatars.githubusercontent.com/u/4880855?v=4?s=100" width="100px;" alt="Kalyan"/><br /><sub><b>Kalyan</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/issues?q=author%3Aarudrakalyan" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/alxnik"><img src="https://avatars.githubusercontent.com/u/2570042?v=4?s=100" width="100px;" alt="Alexandros Nikolopoulos"/><br /><sub><b>Alexandros Nikolopoulos</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/issues?q=author%3Aalxnik" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://rigoli.io"><img src="https://avatars.githubusercontent.com/u/10620399?v=4?s=100" width="100px;" alt="Jacopo Rigoli"/><br /><sub><b>Jacopo Rigoli</b></sub></a><br /><a href="https://github.com/bhubr/react-simple-oauth2-login/issues?q=author%3Adesoss" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!