const { existsSync } = require('fs');
const { basename, resolve } = require('path');

// Normally, the .env file should NOT be tracked with Git
// We do this to provide a facility similar to what Vite and CRA provide
const defaultEnvFile = resolve(__dirname, '..', '.env');
const overrideEnvFile = resolve(__dirname, '..', '.env.local');

const envFile = existsSync(overrideEnvFile) ? overrideEnvFile : defaultEnvFile;

console.log('>> Using env file', basename(envFile));

require('dotenv').config({ path: envFile });

const settings = {
  port: process.env.PORT || 5000,
  oauth: {
    tokenUrl: process.env.OAUTH_TOKEN_URL,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  },
};

module.exports = settings;
