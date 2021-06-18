const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', (req, res) => {
  const { redirect } = req.query;
  res.render('login', { redirect });
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/auth/login?error=1' }),
  (req, res) => {
    const { redirect: redirectTo } = req.body;
    res.redirect(redirectTo || '/');
  },
);

router.get('/logout', (req, res) => {
  res.clearCookie('connect.sid');
  res.redirect('/');
});

module.exports = router;
