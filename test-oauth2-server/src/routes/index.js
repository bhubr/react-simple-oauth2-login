const express = require('express');
const auth = require('./auth');
const oauth = require('./oauth');
const home = require('./home');
const api = require('./api');

const router = express.Router();

router.use('/auth', auth);
router.use('/oauth', oauth);
router.use('/api', api);
router.use('/', home);

module.exports = router;
