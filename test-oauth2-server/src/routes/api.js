const express = require('express');
const oauthServer = require('../middlewares/oauth-server');

const router = express.Router();

router.get(
  '/user',
  oauthServer.authenticate(),
  (req, res) => {
    const { password, ...rest } = res.locals.oauth.token.user;
    res.json(rest);
  },
);

module.exports = router;
