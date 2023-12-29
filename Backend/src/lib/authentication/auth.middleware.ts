import { type NextFunction, type Request, type Response } from 'express';
import { AuthUser } from './auth-user';
import { firebase } from '@/lib/firebase';

export const verifyAuthToken = async (
  // Remove underscore of params once you start using them
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.authUser = new AuthUser();

  const authHeader = req.headers.authorization ?? '';
  const authHeaderSplit = authHeader.split(' ');
  if (authHeaderSplit.length !== 2) {
    return;
  }
  const jwtToken = authHeader.split(' ')[1];
  try {
    const user = await firebase.auth().verifyIdToken(jwtToken);
    req.authUser.setJwtUser(user);
  } catch (error) {
    console.error('Error verifying auth token:', error);
  }
  next();
};
