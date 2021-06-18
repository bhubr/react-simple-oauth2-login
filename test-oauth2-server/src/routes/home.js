const express = require('express');
const App = require('../models/app');

const router = express.Router();

router.get('/', async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.render('home', { user: null });
  }
  const userApps = await App.findByUserId(user.id);
  return res.render('home', { user, userApps });
});

module.exports = router;
