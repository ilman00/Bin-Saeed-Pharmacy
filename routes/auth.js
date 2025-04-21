const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Registration Route (Only Admin should use this)
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = new User({ username, role });
    await User.register(user, password);
    res.redirect('/login');
  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

// Login Routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
