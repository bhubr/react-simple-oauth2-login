const User = require('./user');
const App = require('./app');

/**
 * Constructor.
 */

function InMemoryCache() {
  this.tokens = [];
  this.codes = [];
}

/**
 * Dump the cache.
 */

InMemoryCache.prototype.dump = function dump() {
  console.log('tokens', this.tokens);
  console.log('codes', this.codes);
};

/*
 * Get access token.
 */

InMemoryCache.prototype.getAccessToken = function getAccessToken(bearerToken) {
  const tokens = this.tokens.filter(
    token => token.accessToken === bearerToken,
  );

  return tokens.length ? tokens[0] : false;
};

/**
 * Get refresh token.
 */

InMemoryCache.prototype.getRefreshToken = function getRefreshToken(
  bearerToken,
) {
  const tokens = this.tokens.filter(
    token => token.refreshToken === bearerToken,
  );

  return tokens.length ? tokens[0] : false;
};

/**
 * Get client.
 */

InMemoryCache.prototype.getClient = async function getClient(clientId, clientSecret) {
  const app = await App.findOne(clientId, clientSecret);
  return app || false;
};

/**
 * Save auth code.
 */
InMemoryCache.prototype.saveAuthorizationCode = async function saveAuthorizationCode(code, client, user) {
  const fullCode = {
    ...code,
    client,
    user,
  };
  this.codes.push(fullCode);
  this.dump();
  return fullCode;
};

/**
 * Retrive auth code
 */
InMemoryCache.prototype.getAuthorizationCode = async function getAuthorizationCode(authCode) {
  return this.codes.find(c => c.authorizationCode === authCode);
};

/**
 * Revoke auth code
 */
InMemoryCache.prototype.revokeAuthorizationCode = async function revokeAuthorizationCode(authCode) {
  const codeIndex = this.codes.findIndex(c => c.authorizationCode === authCode.authorizationCode);
  if (codeIndex === -1) {
    return false;
  }
  this.codes.splice(codeIndex, 1);
  return true;
};

/**
 * Save token.
 */

InMemoryCache.prototype.saveToken = function saveToken(token, client, user) {
  const newToken = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    user,
  };
  this.tokens.push(newToken);
  return newToken;
};

/*
 * Get user.
 */

InMemoryCache.prototype.getUser = async function getUser(email, password) {
  const user = await User.findOne(email, password);
  return user || false;
};

/*
 * Validate scope.
 */

InMemoryCache.prototype.validateScope = async function validateScope(user, client, scope) {
  console.log('validateScope', user, client, scope);
  // TODO: actually check scope
  return [];
};

/**
 * Export constructor.
 */

module.exports = InMemoryCache;
