// Ideally you should take these vars from process.env.REACT_APP_*
// and define them in e.g. .env.local (if you're using Create React App)

// Authorization screen base URL
// e.g. https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
export const authorizationUrl = '';

// To get a client ID, create an app, e.g.
// GitHub (authorization code grant only): https://github.com/settings/developers
// Spotify (implicit grant): https://developer.spotify.com/dashboard/applications
export const clientId = '';

// You get to configure this in your OAuth settings
// If you use React Router, the relative path (empty here) can match
// that of a route which displays nothing
export const redirectUri = 'http://localhost:1234/';
