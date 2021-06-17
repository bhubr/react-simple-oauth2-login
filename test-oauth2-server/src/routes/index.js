const express = require('express');
const auth = require('./auth');
const home = require('./home');

const router = express.Router();

router.use('/auth', auth);
router.use('/', home);

module.exports = router;
