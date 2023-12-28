import { Router } from 'express';
import passport from 'passport';
import Controller from './users.controller';

const users: Router = Router();
const controller = new Controller();

/**
 * Create user body
 * @typedef {object} CreateUserBody
 * @property {string} email.required - email of user
 * @property {string} name.required - name of user
 * @property {string} cognitoId.required - cognito id
 * @property {string} phone - phone number
 */
/**
 * User
 * @typedef {object} User
 * @property {string} email - email of user
 * @property {string} name - name of user
 * @property {string} cognitoId - cognito id
 * @property {string} phone - phone number
 */
/**
 * POST /users/create
 * @summary Create user
 * @tags users
 * @param {CreateUserBody} request.body.required
 * @return {User} 201 - user created
 */
/** Login */
// auth with google
users.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
// callback route for google to redirect
users.get(
  '/auth/google/redirect',
  passport.authenticate('google'),
  controller.authRedirectGoogle
);
// auth logout
users.post('/auth/logout', controller.authLogout);
export default users;
