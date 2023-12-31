import { Router } from 'express';
import UserController from './users.controller';

const users: Router = Router();
const userController = new UserController();

// Endpoint for user registration
users.post('/finishRegistration', userController.registerUser);
users.post('/continueLogin', userController.loginUser);

export default users;
