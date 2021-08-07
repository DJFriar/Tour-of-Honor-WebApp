module.exports = function(req, res, next) {
  if (req.user.isAdmin) {
    return next();
  }

  // If the user is not an admin, redirect them to the homepage.
  return res.redirect("/");
}