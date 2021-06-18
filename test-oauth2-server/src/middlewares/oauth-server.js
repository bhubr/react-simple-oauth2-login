const OAuthServer = require('express-oauth-server');
const Token = require('../models/token');

module.exports = new OAuthServer({
  model: new Token(), // See https://github.com/oauthjs/node-oauth2-server for specification
  allowEmptyState: true,
});
