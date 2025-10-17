const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const isAuthenticated = require('../middlewares/auth')
// Registration Route (Only Admin should use this)
router.get('/register',isAuthenticated, (req, res) => {
  res.render('register');
});

router.post('/register', isAuthenticated, async (req, res) => {
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
router.get('/login',(req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    
    req.session.destroy(function(err) {
      if (err) {
        console.log('Failed to destroy session during logout:', err);
        return res.redirect('/dashboard');
      }

      res.clearCookie('connect.sid'); // remove cookie from browser
      res.redirect('/login');
    });
  });
});


module.exports = router;
