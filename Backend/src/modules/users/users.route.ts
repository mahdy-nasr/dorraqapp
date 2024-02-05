import { Router } from 'express';
import UserController from './users.controller';
import { CreateUserRequestDto } from './dto/user.dto';
import { UserRole } from './users-types';
import { uploadVideo } from '@/lib/multer-video';
import { RequestTypeValidator } from '@/middlewares/request-validator';
import { AuthGuard } from '@/lib/authentication/auth.guard';
import { uploadImage } from '@/lib/multer-image';
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
 * @property {string} city - city of user
 * @property {string} university - university of user
 * @property {string} language - language of user
 * @property {string} createdAt - created at
 * @property {string} role - role
 * @property {string} phone - phone number
 * @property {string} gender - gender of user
 * @property {string} education - education of user
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

/**
 * PUT /users/settings
 * @summary Update user Information
 * @tags users
 * @return {User} 201 - user Info Updated
 * @return  401 - unauthorized
 * @return  403 - forbidden
 */
users.put(
  '/settings',
  AuthGuard(),
  uploadImage.single('image'),
  userController.updateUserInfo
);

// dashboard instructor api
// courses
users.get(
  '/my-courses',
  AuthGuard(UserRole.TEACHER),
  userController.getCourses
);

users.post(
  '/create-course',
  AuthGuard(UserRole.TEACHER),
  uploadImage.single('image'),
  userController.createCourse
);

users.delete(
  '/delete-course',
  AuthGuard(UserRole.TEACHER),
  userController.deleteCourse
);

users.put(
  '/update-course/:id',
  AuthGuard(UserRole.TEACHER),
  uploadImage.single('image'),
  userController.updateCourse
);

// lessons
users.get(
  '/my-lessons',
  AuthGuard(UserRole.TEACHER),
  userController.getLessons
);

users.post(
  '/create-lesson',
  AuthGuard(UserRole.TEACHER),
  userController.createLesson
);

users.delete(
  '/delete-lesson',
  AuthGuard(UserRole.TEACHER),
  userController.deleteLesson
);

users.put(
  '/update-lesson/:id',
  AuthGuard(UserRole.TEACHER),
  uploadImage.single('image'),
  userController.updateLesson
);

// Upload lesson data
users.post(
  '/upload-video',
  uploadVideo.single('video'),
  AuthGuard(UserRole.TEACHER),
  userController.addVideo
);

users.post('/upload-blog', AuthGuard(UserRole.TEACHER), userController.addBlog);

users.post(
  '/upload-quiz',
  AuthGuard(UserRole.TEACHER),
  userController.createQuizWithQuestionsAndOptions
);

// get lesson data
// video for lesson by lesson Id
// blog ==
// quiz by lessin Id and quiz info ?

// delete video - blog - quiz by Id
// users.post('/review', AuthGuard(UserRole.STUDENT), userController.addReview);
// users.post('/my-students', AuthGuard(UserRole.TEACHER), userController.getStudents);
// progress
// feedback questions (per class)
// Question banks

export default users;
