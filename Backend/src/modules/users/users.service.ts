import {
  type User,
  type Course,
  type Lessons,
  type Video,
  type Blog,
  type Quiz,
} from '@prisma/client';
import { type UpdateUserRequestDto } from './dto/user-settings.dto';
import { type UpdateCourseRequestDto } from './dto/update-course.dto';
import { type UpdateLessonRequestDto } from './dto/update-lesson.dto';
import { HttpBadRequestError } from '@/lib/errors';

import prisma from '@/lib/prisma';
// User
interface CreateUserInput {
  firebaseUid: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | undefined;
  phone: string | undefined;
}
export interface UpdateUserInput {
  id: string;
  data: Partial<UpdateUserRequestDto>;
}

// Course
export interface UpdateCourseInput {
  id: string;
  instructorId: string;
  data: Partial<UpdateCourseRequestDto>;
}
export interface CreateCourseInput {
  fullName: string;
  shortName: string;
  description: string;
  coverPicture: string;
  level: string;
  slug: string;
  instructorId: string; // from token
}

// lesson
export interface CreateLossonInput {
  instructorId: string;
  courseId: string;
  lessonTitle: string;
  lessonNumber: number;
  description: string;
  tag: string;
}

export interface UpdateLessonInput {
  id: string;
  data: Partial<UpdateLessonRequestDto>;
}

export interface UploadLessonVideo {
  lessonsId: string;
  videoLink: string;
}
export interface UploadLessonBlog {
  lessonsId: string;
  blogBody: string;
}

export interface CreateQuizInput {
  lessonId: string;
  questions: Array<{
    questionBody: string;
    questionPoints: number;
    options: Array<{
      optionBody: string;
      isCorrect: boolean;
    }>;
  }>;
}
export default class UserService {
  // User
  public async createUser(userData: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        firebaseUid: userData.firebaseUid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profilePicture: userData.profilePicture,
        phone: userData.phone,
      },
    });
    return user;
  }

  public async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  public async findUserById(firebaseUid: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });
    return user;
  }

  public async updateUser(userData: UpdateUserInput): Promise<User> {
    const { id, data } = userData;

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    return updatedUser;
  }

  /* Course */
  // get all courses
  public async getCoursesByTeacherId(instructorId: string): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      where: { instructorId },
    });
    return courses;
  }

  // get one course
  public async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
    });
    return course;
  }

  // delete course By courseId
  public async deleteCourseById(id: string): Promise<void> {
    await prisma.course.delete({
      where: { id },
    });
  }

  // update course
  public async updateCourse(
    updateCourseData: UpdateCourseInput
  ): Promise<Course> {
    const { id, instructorId, data } = updateCourseData;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...data,
        instructor: {
          connect: {
            id: instructorId,
          },
        },
      },
    });
    return updatedCourse;
  }

  public async createCourse(courseData: CreateCourseInput): Promise<Course> {
    const course = await prisma.course.create({
      data: {
        fullName: courseData.fullName,
        shortName: courseData.shortName,
        description: courseData.description,
        coverPicture: courseData.coverPicture,
        level: courseData.level,
        slug: courseData.slug,
        instructor: {
          connect: {
            id: courseData.instructorId,
          },
        },
      },
    });
    return course;
  }

  // lesson
  // get all lesson
  public async getAllLessonsByCourseId(courseId: string): Promise<Lessons[]> {
    const courses = await prisma.lessons.findMany({
      where: { courseId },
    });
    return courses;
  }

  // get one course
  public async getLessonById(id: string) {
    const lesson = await prisma.lessons.findUnique({
      where: { id },
    });
    return lesson;
  }

  // create Lesson
  public async createLesson(lessonData: CreateLossonInput): Promise<Lessons> {
    const {
      courseId,
      instructorId,
      lessonTitle,
      lessonNumber,
      description,
      tag,
    } = lessonData;
    // Ensure that the teacher (user) is the instructor of the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true }, // Include the instructor information
    });

    if (!course || course.instructorId !== instructorId) {
      // The user is not the instructor of the course
      throw new HttpBadRequestError('User is not the instructor of the course');
    }

    const lesson = await prisma.lessons.create({
      data: {
        lessonTitle,
        lessonNumber,
        description,
        tag,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    return lesson;
  }

  // delete one lesson
  public async deleteLessonByLessonId(id: string): Promise<void> {
    await prisma.lessons.delete({
      where: { id },
    });
  }

  //  update lesson
  public async updateLesson(
    updateLessonData: UpdateLessonInput
  ): Promise<Lessons> {
    const { id, data } = updateLessonData;

    const lesson = await prisma.lessons.update({
      where: { id },
      data,
    });
    return lesson;
  }

  // Uploads
  // Video
  public async addVideo(videoData: UploadLessonVideo): Promise<Video> {
    const { lessonsId, videoLink } = videoData;
    // Ensure that the teacher (user) is the instructor of the course
    const video = await prisma.video.create({
      data: {
        videoLink,
        lesson: {
          connect: {
            id: lessonsId,
          },
        },
      },
    });

    return video;
  }

  // Blog
  public async addBlog(blogData: UploadLessonBlog): Promise<Blog> {
    const { lessonsId, blogBody } = blogData;
    const blog = await prisma.blog.create({
      data: {
        blogBody,
        lesson: {
          connect: {
            id: lessonsId,
          },
        },
      },
    });

    return blog;
  }

  // Quiz && question && options
  public async createQuizWithQuestionsAndOptions(
    quizData: CreateQuizInput
  ): Promise<Quiz> {
    const { lessonId, questions } = quizData;

    const quiz = await prisma.quiz.create({
      data: {
        lesson: {
          connect: {
            id: lessonId,
          },
        },
      },
    });

    // Create each question and its options
    for (const questionData of questions) {
      const { questionBody, questionPoints, options } = questionData;

      const question = await prisma.question.create({
        data: {
          questionBody,
          questionPoints,
          quiz: {
            connect: {
              id: quiz.id,
            },
          },
        },
      });

      // Create options for the question
      for (const optionData of options) {
        await prisma.option.create({
          data: {
            ...optionData,
            question: {
              connect: {
                id: question.id,
              },
            },
          },
        });
      }
    }

    return quiz;
  }
}
