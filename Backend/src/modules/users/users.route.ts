import { Router } from 'express';
import UserController from './users.controller';
import { CreateUserRequestDto } from './dto/user.dto';
import { RequestTypeValidator } from '@/middlewares/request-validator';
import { AuthGuard } from '@/lib/authentication/auth.guard';

const users: Router = Router();
const userController = new UserController();

/**
 * Create user body
 * @typedef {object} CreateUserBody
 * @property {string} firstName.required - first name of user
 * @property {string} lastName.required - last name of user
 */
/**
 * User
 * @typedef {object} User
 * @property {string} id - id of user
 * @property {string} email - email of user
 * @property {string} firstName - name of user
 * @property {string} lastName - name of user
 * @property {string} profilePicture - profile picture of user
 * @property {string} country - country of user
 * @property {string} university - university of user
 * @property {string} language - language of user
 * @property {string} createdAt - created at
 * @property {string} role - role
 * @property {string} phone - phone number
 */
/**
 * POST /users/continue-registration
 * @summary Create user
 * @tags users
 * @param {CreateUserBody} request.body.required
 * @return {User} 201 - user created
 */
users.post(
  '/continue-registration',
  RequestTypeValidator(CreateUserRequestDto),
  userController.continueUserRegistration
);

/**
 * GET /users/login
 * @summary Login user
 * @tags users
 * @return {User} 200 - user logged in
 * @return  401 - unauthorized
 * @return  403 - forbidden
 */
users.get('/login', AuthGuard(), userController.login);

export default users;
