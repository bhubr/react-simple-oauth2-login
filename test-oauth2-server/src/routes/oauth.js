const express = require('express');
const util = require('util');
const generateToken = require('../helpers/generate-token');
const App = require('../models/app');
const User = require('../models/user');
const oauthServer = require('../middlewares/oauth-server');

const router = express.Router();

// Get authorization.
router.get('/authorize', async (req, res) => {
  const {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope,
  } = req.query;
  if (!clientId || !redirectUri || !responseType || !scope) {
    return res.send(
      'Missing one of required params `client_id`, `redirect_uri`, `response_type`, `scope`',
    );
  }
  // Redirect anonymous users to login page.
  const { user } = req;
  if (!user) {
    const redirectTo = util.format(
      '/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=%s&scope=%s',
      req.query.client_id,
      req.query.redirect_uri,
      req.query.response_type,
      req.query.scope,
    );
    return res.redirect(
      `/auth/login?redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  const state = await generateToken();
  try {
    const oauthApp = await App.findOneByClientId(clientId);
    if (!oauthApp) {
      return res
        .status(401)
        .json(`INVALID CLIENT - No client with id ${clientId}`);
    }

    const appOwner = await User.findById(oauthApp.userId);

    const { scopes: appScopes, name: appName } = oauthApp;

    return res.render('authorize', {
      fullname: user.name,
      app: {
        name: appName,
        scopes: appScopes,
        owner: appOwner,
      },
      action: `/oauth/authorize?state=${state}&response_type=${req.query.response_type}`,
      client_id: req.query.client_id,
      redirect_uri: req.query.redirect_uri,
      response_type: req.query.response_type,
      grant_type: 'authorization_code',
      // scope: req.query.scope,
      user,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post(
  '/authorize',
  oauthServer.authorize({
    authenticateHandler: {
      handle: req => req.user,
    },
  }),
);

router.post('/token', oauthServer.token());

module.exports = router;
