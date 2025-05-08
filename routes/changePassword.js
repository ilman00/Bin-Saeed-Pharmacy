const express = require('express');
const User = require('../models/User'); // Adjust to your actual User model
const router = express.Router();
const isAuthenticated = require('../middlewares/auth');

// Middleware to ensure admin access
// function ensureAdmin(req, res, next) {
//   if (req.user && req.user.role === 'admin') {
//     return next();
//   }
//   res.status(403).send('Access denied');
// }

router.get('/change-password', isAuthenticated, (req, res) => {
  res.render('change_password', { message: null, success: false });
});

// POST /admin/reset-password
// Requires the user to be logged in
router.post('/change-password', async (req, res) => {
  const { username, newPassword, confirmPassword } = req.body;

  if (!req.user) {
    return res.status(401).render('change_password', {
      message: 'You must be logged in to change your password.',
      success: false
    });
  }

  if (!newPassword || !confirmPassword || !username) {
    return res.render('change_password', {
      message: 'All fields are required.',
      success: false
    });
  }

  if (newPassword !== confirmPassword) {
    return res.render('change_password', {
      message: 'Passwords do not match.',
      success: false
    });
  }

  try {
    const user = await User.findOne({username});
    user.setPassword(newPassword, async (err) => {
      if (err) {
        // handle error
        return res.render('change_password', {
          message: 'Error updating password.',
          success: false
        });
      }

      await user.save();

      return res.render('change_password', {
        message: 'Password changed successfully.',
        success: true
      });
    });

  } catch (err) {
    console.error(err);
    return res.render('change_password', {
      message: 'Something went wrong.',
      success: false
    });
  }
});



module.exports = router;
