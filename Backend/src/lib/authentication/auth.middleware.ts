import { type NextFunction, type Request, type Response } from 'express';
import { AuthUser } from './auth-user';

export async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.authUser = new AuthUser();
  const authHeader = req.headers.authorization ?? '';
  const authHeaderSplit = authHeader.split(' ');
  if (authHeaderSplit.length !== 2) {
    next();
    return;
  }
  const jwt = authHeader.split(' ')[1];
  await req.authUser.initializeWithJWT(jwt);
  next();
}
