import { type NextFunction, type Request, type Response } from 'express';
import { HttpStatusCode } from 'axios';
import { type UserRole } from '@/modules/users/users-types';

// This is a middleware that checks if the user is authenticated or not.
// You can use it to protect routes that require authentication.
// E.g. users.get('/me', AuthGuard(), (req, res) => { ... });
// If the user is not authenticated, route will not be called and
// the user will receive a 403 response.
export function AuthGuard(role: UserRole | undefined = undefined) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.authUser?.isAuthenticated()) {
      return res.sendStatus(HttpStatusCode.Forbidden);
    }
    if (!!role && !req.authUser?.isAuthorized(role)) {
      return res.sendStatus(HttpStatusCode.Unauthorized);
    }

    // User is authenticated and authorized, continue
    next();
  };
}
