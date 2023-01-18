// IMPORTANT!

// This repo's React examples are built using vitejs.
// This is why the environment variables are prefixed with VITE_.

// IF you use Create React App:
//   1. you should prefix the variables with REACT_APP_ instead of VITE_.
//   2. you should access variables via process.env.REACT_APP_* instead of import.meta.env.VITE_*.

// Default values are set in .env here. Usually, you should not commit .env files.
// However, you can override values in .env by creating .env.local and setting new values.

// Authorization screen base URL
// e.g. https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
// export const authorizationUrl = 'https://accounts.spotify.com/authorize';
// export const authorizationUrl = 'http://localhost:4000/authorize';
export const authorizationUrl = import.meta.env.VITE_OAUTH2_AUTHORIZATION_URL;

// To get a client ID, create an app, e.g.
// GitHub (authorization code grant only): https://github.com/settings/developers
// Spotify (implicit grant & auth code): https://developer.spotify.com/dashboard/applications
// export const clientId = 'peggy-app';
export const clientId = import.meta.env.VITE_OAUTH2_CLIENT_ID;

// You get to configure this in your OAuth settings
// If you use React Router, the relative path (empty here) can match
// that of a route which displays nothing
// export const redirectUri = 'http://localhost:1234/oauth/callback';
export const redirectUri = import.meta.env.VITE_OAUTH2_REDIRECT_URI;

// Authorization code flow only: base URL for your server
// The one provided below is that of the sample Express server provided
// export const serverUrl = 'http://localhost:5000';

export const scope = import.meta.env.VITE_OAUTH2_SCOPE;
