import { type NextFunction, type Request, type Response } from 'express';
import { HttpStatusCode } from 'axios';
import { ApiError, HttpUnAuthorizedError } from '../errors';
import { type UserRole } from '@/modules/users/users-types';

// This is a middleware that checks if the user is authenticated or not.
// You can use it to protect routes that require authentication.
// E.g. users.get('/me', AuthGuard(), (req, res) => { ... });
// If the user is not authenticated, route will not be called and
// the user will receive a 403 response.
export function AuthGuard(role: UserRole | undefined = undefined) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.authUser?.isAuthenticated()) {
      throw new ApiError(HttpStatusCode.Forbidden, 'User is not authenticated');
    }
    if (!!role && !req.authUser?.isAuthorized(role)) {
      throw new HttpUnAuthorizedError('User is not authorized');
    }
    // User is authenticated and authorized, continue
    next();
  };
}
