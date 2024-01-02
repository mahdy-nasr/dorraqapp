import { type AuthUser } from './auth-user';

// Augment the express Request type
declare module 'express' {
  export interface Request {
    authUser?: AuthUser;
  }
}
