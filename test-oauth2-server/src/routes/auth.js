const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/auth/login?error=1' }),
  (req, res) => res.redirect('/'));

router.get('/logout', (req, res) => {
  res.clearCookie('connect.sid');
  res.redirect('/');
});

module.exports = router;
