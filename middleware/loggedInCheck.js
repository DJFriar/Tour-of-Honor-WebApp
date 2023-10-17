module.exports = function isLoggedIn(req, res, next) {
  // Logged in
  if (req.user) {
    return next();
  }

  // Not logged in
  return res.redirect('/login');
};
