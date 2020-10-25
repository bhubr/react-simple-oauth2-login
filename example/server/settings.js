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
