export function isLoggedIn(req, res, next) {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash('error', 'First login to the page');
    if (!req.session.redirectUrl) {
      req.session.redirectUrl = req.originalUrl;
    }
    return res.redirect('/user/login');
  }
  next();
}

export function saveRedirectUrl(req, res, next) {
  const redirect = req.session.redirectUrl
  if (redirect) {
    res.locals.redirect = redirect;
  }
  else {
    res.locals.redirect = '/';
  }

  next();
}

