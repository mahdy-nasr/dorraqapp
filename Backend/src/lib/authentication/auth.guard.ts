// This is a middleware that checks if the user is authenticated or not.
// You can use it to protect routes that require authentication.
// E.g. users.get('/me', AuthGuard, (req, res) => { ... });
// If the user is not authenticated, route will not be called and
// the user will receive a 403 response.
export const AuthGuard = (req, res, next) => {
  if (req.authUser.isAuthenticated()) {
    next();
    return;
  }
  return res.status(403).json({
    message: 'Unauthenticated',
  });
};
