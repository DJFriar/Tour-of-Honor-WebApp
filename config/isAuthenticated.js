// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function(req, res, next) {
  req.session.returnTo = req.originalUrl;
  source = req.route.path;
  publicPages = ["/", "/login", "/signup", "/history", "/contact"];
  privatePages = ["/admin", "/user-profile", "/review", "/submit"]

  // Logged in, private page
  if (req.user && !publicPages.includes(source)) {
    req.user.destinationURL = req.originalUrl;
    // return res.redirect(req.session.returnTo || '/');
    // req.session.redirect = null;
    // return res.render(source, { activeUser: true, user: req.user });
    console.log("==== isAuthenticated req.user ====");
    console.log(req.user);
    return next();
  }

  // logged in, public page
  if (req.user && publicPages.includes(source)) {
    if (source === "/") {
      return next();
    }
    return res.render("pages" + source, { activeUser: true, user: req.user });
  }

  // not logged in, private page
  if (!req.user && !publicPages.includes(source)) {
    return res.redirect("/login");
  }

  // not logged in, public page
  if (!req.user && publicPages.includes(source)) {
    if (source === "/") {
      return next();
    }
    return res.render("pages" + source, { activeUser: false });
  }

  // everything failed
  return res.redirect("/");
};
