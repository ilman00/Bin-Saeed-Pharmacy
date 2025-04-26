// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // User is logged in, proceed to the next middleware/route handler
    }
    res.redirect('/login'); // User is not logged in, redirect to login page
  }

  module.exports = isAuthenticated;