import { type AuthUser } from './auth-user';

// Augment the express Request type
declare module 'express' {
  interface Request {
    authUser: AuthUser;
  }
}