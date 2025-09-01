const httpsRedirect = (req, res, next) => {
  if (req.secure) {
    return next();
  }
  res.redirect(`https://${req.headers.host}${req.url}`);
};

module.exports = httpsRedirect;