const httpsRedirect = (req, res, next) => {
  // Skip redirect if already secure or if behind a proxy (like Vercel)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  res.redirect(`https://${req.headers.host}${req.url}`);
};

module.exports = httpsRedirect;