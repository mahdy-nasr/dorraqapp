import { type Response, type Request } from 'express';
import {
  type User,
  type Course,
  type Lessons,
  type Video,
  type Blog,
  type Quiz,
} from '@prisma/client';
import { HttpStatusCode as Status } from 'axios';
import UserService from './users.service';
import {
  type UpdateUserInput,
  type CreateCourseInput,
  type UpdateCourseInput,
  type CreateLossonInput,
  type UpdateLessonInput,
  type UploadLessonVideo,
  type UploadLessonBlog,
  type CreateQuizInput,
  type CreateEnrollmentInput,
  type getVideoInput,
} from './users.service';
import { type CreateUserRequestDto } from './dto/user.dto';
import { type UpdateUserRequestDto } from './dto/user-settings.dto';
import { type UpdateCourseRequestDto } from './dto/update-course.dto';
import { type UpdateLessonRequestDto } from './dto/update-lesson.dto';
import Api from '@/lib/api';
import { HttpBadRequestError, HttpInternalServerError } from '@/lib/errors';

export default class UserController extends Api {
  private readonly userService = new UserService();

  public login = async (req: Request, res: Response<User>) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    this.send(res, req.authUser?.getUser()!);
  };

  public continueUserRegistration = async (
    req: Request<unknown, unknown, CreateUserRequestDto>,
    res: Response<User>
  ) => {
    if (req.authUser?.isAuthenticated()) {
      return this.send(res, req.authUser.getUser()!);
    }
    if (!req.authUser?.getDecodedJWT()) {
      throw new HttpBadRequestError('Invalid JWT token');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const decodedJWT = req.authUser?.getDecodedJWT()!;
    try {
      const user = await this.userService.createUser({
        firebaseUid: decodedJWT.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: decodedJWT.email!,
        profilePicture: decodedJWT.picture,
        phone: decodedJWT.phone_number,
      });
      console.log(user);
      return this.send(res, user, Status.Created);
    } catch (error) {
      throw new HttpInternalServerError(
        (error as Error)?.message ?? 'Error while creating user'
      );
    }
  };

  public updateUserInfo = async (
    req: Request<unknown, unknown, UpdateUserRequestDto>,
    res: Response
  ) => {
    const userId = req.authUser?.getUser()?.id;
    if (!userId) {
      throw new HttpBadRequestError('User ID not found');
    }
    const data: Partial<UpdateUserInput['data']> = {};
    // Mapping request body fields to data object
    const fieldsToUpdate: Array<keyof UpdateUserRequestDto> = [
      'firstName',
      'lastName',
      'country',
      'city',
      'university',
      'education',
      'phone',
      'language',
      'gender',
      'profilePicture',
    ];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field]) {
        data[field] = req.body[field];
      }
    });
    // Handle profile picture
    const imageFilePath: string | undefined = req.file?.filename
      ? encodeURIComponent(req.file.filename)
      : undefined;

    if (imageFilePath) {
      data.profilePicture = `http://localhost:3000/image/${imageFilePath}`;
    }

    const updatedUser = await this.userService.updateUser({
      id: userId,
      data,
    });

    this.send(res, updatedUser, Status.Ok);
  };

  /* Course */
  // get all courses
  public getCourses = async (req: Request, res: Response<Course[]>) => {
    const instructorId = req.authUser?.getUser()?.id;
    if (!instructorId) {
      throw new HttpBadRequestError('User ID not found');
    }
    const courses = await this.userService.getCoursesByTeacherId(instructorId);
    console.log(courses);
    this.send(res, courses, Status.Ok);
  };

  // get one course
  public getCours = async (req: Request, res: Response) => {
    const id = req.body.courseId;
    const course = await this.userService.getCourseById(id);
    this.send(res, course, Status.Ok);
  };

  // create course
  public createCourse = async (
    req: Request<unknown, unknown, CreateCourseInput>,
    res: Response<Course>
  ) => {
    const instructorId = req.authUser?.getUser()?.id;
    if (!instructorId) {
      throw new HttpBadRequestError('Instructor ID not found');
    }
    // Handle profile picture
    const imageFilePath: string | undefined = req.file?.filename
      ? encodeURIComponent(req.file.filename)
      : undefined;
    let profilePicture = '';
    if (imageFilePath) {
      profilePicture = `http://localhost:3000/image/${imageFilePath}`;
    }
    const courseData: CreateCourseInput = {
      fullName: req.body.fullName,
      shortName: req.body.shortName,
      description: req.body.description,
      coverPicture: profilePicture,
      level: req.body.level,
      slug: req.body.slug,
      instructorId,
    };
    try {
      const course = await this.userService.createCourse(courseData);
      console.log(course);
      this.send(res, course, Status.Ok);
    } catch (error) {
      console.error(error);
      throw new HttpInternalServerError('Error while creating course');
    }
  };

  // delete course
  public deleteCourse = async (req: Request, res: Response) => {
    const id = req.body.courseId;
    const existingCourse = await this.userService.getCourseById(id);
    if (!existingCourse) {
      throw new HttpBadRequestError('Course not found');
    }
    try {
      await this.userService.deleteCourseById(id);
      this.send(res, Status.NoContent);
    } catch (error) {
      console.error(error);
      throw new HttpInternalServerError('Error while deleting course');
    }
  };

  // update course
  public updateCourse = async (
    req: Request<{ id: string }, UpdateCourseRequestDto>,
    res: Response
  ) => {
    const instructorId = req.authUser?.getUser()?.id;
    if (!instructorId) {
      throw new HttpBadRequestError('User ID not found');
    }

    const courseId = req.params.id; // or however you retrieve the course id from the request
    const data: Partial<UpdateCourseInput['data']> = {};

    const fieldsToUpdate: Array<keyof UpdateCourseRequestDto> = [
      'fullName',
      'shortName',
      'description',
      'coverPicture',
      'level',
      'slug',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field]) {
        data[field] = req.body[field]!;
      }
    });
    // Handle profile picture
    const imageFilePath: string | undefined = req.file?.filename
      ? encodeURIComponent(req.file.filename)
      : undefined;

    if (imageFilePath) {
      data.coverPicture = `http://localhost:3000/image/${imageFilePath}`;
    }
    console.log(data);
    const updatedCourse = await this.userService.updateCourse({
      id: courseId,
      instructorId,
      data,
    });

    this.send(res, updatedCourse, Status.Ok);
  };

  // lessons
  // create lesson
  public createLesson = async (
    req: Request<unknown, unknown, CreateLossonInput>,
    res: Response<Lessons>
  ) => {
    const instructorId = req.authUser?.getUser()?.id;
    if (!instructorId) {
      throw new HttpBadRequestError('User ID not found');
    }
    const lessonData: CreateLossonInput = {
      instructorId,
      courseId: req.body.courseId,
      lessonTitle: req.body.lessonTitle,
      lessonNumber: req.body.lessonNumber,
      description: req.body.description,
      tag: req.body.tag,
    };

    const lesson = await this.userService.createLesson(lessonData);
    console.log(lesson);
    this.send(res, lesson, Status.Ok);
  };

  // get all lessons
  public getLessons = async (req: Request, res: Response<Lessons[]>) => {
    const courseID = req.body.courseId;
    const lessons = await this.userService.getAllLessonsByCourseId(courseID);
    console.log(lessons);
    this.send(res, lessons, Status.Ok);
  };

  // delete lesson
  public deleteLesson = async (req: Request, res: Response) => {
    const id = req.body.lessonId;
    const existingLesson = await this.userService.getLessonById(id);
    if (!existingLesson) {
      throw new HttpBadRequestError('Lesson not found');
    }
    try {
      await this.userService.deleteLessonByLessonId(id);
      this.send(res, Status.NoContent);
    } catch (error) {
      console.error(error);
      throw new HttpInternalServerError('Error while deleting Lesson');
    }
  };

  // update Lesson
  public updateLesson = async (
    req: Request<{ id: string }, UpdateLessonRequestDto>,
    res: Response
  ) => {
    const lessonId = req.params.id; // or however you retrieve the course id from the request
    const data: Partial<UpdateLessonInput['data']> = {};

    const fieldsToUpdate: Array<keyof UpdateLessonRequestDto> = [
      'lessonTitle',
      'lessonNumber',
      'description',
      'tag',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field]) {
        data[field] = req.body[field]!;
      }
    });

    const updatedCourse = await this.userService.updateLesson({
      id: lessonId,
      data,
    });

    this.send(res, updatedCourse, Status.Ok);
  };

  // Upload
  public addVideo = async (
    req: Request<unknown, unknown, UploadLessonVideo>,
    res: Response<Video>
  ) => {
    const lessonsId = req.body.lessonsId;
    // Handle video
    const videoFilePath: string | undefined = req.file?.filename
      ? encodeURIComponent(req.file.filename)
      : undefined;

    let videoLink = '';
    if (videoFilePath) {
      videoLink = `http://localhost:3000/video/${videoFilePath}`;
    }
    const videoData: UploadLessonVideo = {
      lessonsId,
      videoLink,
    };

    const video = await this.userService.addVideo(videoData);
    console.log(video);
    this.send(res, video, Status.Ok);
  };

  // Blog
  public addBlog = async (
    req: Request<unknown, unknown, UploadLessonBlog>,
    res: Response<Blog>
  ) => {
    const lessonsId = req.body.lessonsId;
    const blogBody = req.body.blogBody;
    const blogData: UploadLessonBlog = {
      lessonsId,
      blogBody,
    };

    const blog = await this.userService.addBlog(blogData);
    this.send(res, blog, Status.Ok);
  };

  // Quiz
  public createQuizWithQuestionsAndOptions = async (
    req: Request<unknown, unknown, CreateQuizInput>,
    res: Response<Quiz>
  ) => {
    try {
      const lessonId = req.body.lessonId;
      const questions = req.body.questions;
      const quizData: CreateQuizInput = {
        lessonId,
        questions,
      };
      const quiz = await this.userService.createQuizWithQuestionsAndOptions(
        quizData
      );
      this.send(res, quiz, Status.Created);
    } catch (error) {
      console.error(error);
      throw new HttpInternalServerError('Error while creating quiz');
    }
  };

  // get lesson info
  // video
  public getVideo = async (
    req: Request<unknown, unknown, getVideoInput>,
    res: Response<Video>
  ) => {
    const videoId = req.body.videoId;
    const studentId = req.body.studentId;
    const classId = req.body.classId;

    const videoData: getVideoInput = {
      videoId,
      studentId,
      classId,
    };

    const video = await this.userService.getVideoById(videoData);
    this.send(res, video!, Status.Ok);
  };

  // blog
  public getBlog = async (req: Request, res: Response) => {
    const id = req.body.lessonId;
    const blog = await this.userService.getBlogById(id);
    this.send(res, blog, Status.Ok);
  };

  // get question by quizId
  public getQuestion = async (req: Request, res: Response) => {
    const quizId = req.body.quizId;
    const question = await this.userService.getQuestionsByQuizId(quizId);
    this.send(res, question, Status.Ok);
  };

  // enroll in class
  public enrollInClassRoom = async (
    req: Request<unknown, unknown, CreateEnrollmentInput>,
    res: Response
  ) => {
    const studentId = req.body.studentId;
    const classId = req.body.classId;
    const enrollData: CreateEnrollmentInput = {
      studentId,
      classId,
    };

    await this.userService.enrollInClass(enrollData);
    this.send(res, Status.Ok);
  };
}
