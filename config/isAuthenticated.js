// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  const source = req.route.path;
  const publicPages = ['/', '/login', '/signup', '/history', '/contact'];

  // Logged in, private page
  if (req.user && !publicPages.includes(source)) {
    req.user.destinationURL = req.originalUrl;
    return next();
  }

  // logged in, public page
  if (req.user && publicPages.includes(source)) {
    if (source === '/') {
      return next();
    }
    return res.render(`pages${source}`, { activeUser: true, user: req.user });
  }

  // not logged in, private page
  if (!req.user && !publicPages.includes(source)) {
    return res.redirect('/login');
  }

  // not logged in, public page
  if (!req.user && publicPages.includes(source)) {
    if (source === '/') {
      return next();
    }
    return res.render(`pages${source}`, { activeUser: false });
  }

  // everything failed
  return res.redirect('/');
};
