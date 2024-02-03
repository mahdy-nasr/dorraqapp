-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "firebaseUid" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "role" VARCHAR(100) NOT NULL DEFAULT 'student',
    "phone" VARCHAR(30),
    "profilePicture" VARCHAR(255),
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "university" VARCHAR(100),
    "education" VARCHAR(100),
    "language" VARCHAR(100) NOT NULL DEFAULT 'arabic',
    "gender" VARCHAR(10),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lessonNumber" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "courseId" UUID NOT NULL,
    "tag" VARCHAR(255) NOT NULL,
    "studentId" UUID NOT NULL,
    "classId" UUID NOT NULL,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" UUID NOT NULL,
    "class_schedule" VARCHAR(100) NOT NULL,
    "live_start_time" VARCHAR(100) NOT NULL,
    "live_end_time" TEXT NOT NULL,
    "class_is_live" VARCHAR(255) NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(6) NOT NULL,
    "createdAt" VARCHAR(15) NOT NULL,
    "length" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" UUID NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "shortName" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "coverPicture" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "level" VARCHAR(15) NOT NULL,
    "length" INTEGER,
    "slug" TEXT NOT NULL,
    "instructorId" UUID NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courseReview" (
    "id" UUID NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "reviewText" TEXT NOT NULL,
    "studentId" UUID NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "courseReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL,
    "lessonTitle" VARCHAR(100) NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "tag" VARCHAR(255) NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog" (
    "id" UUID NOT NULL,
    "blogBody" TEXT NOT NULL,
    "lessonsId" UUID NOT NULL,

    CONSTRAINT "blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video" (
    "id" UUID NOT NULL,
    "videoLink" VARCHAR(255) NOT NULL,
    "lessonsId" UUID NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" UUID NOT NULL,
    "lessonsId" UUID NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" UUID NOT NULL,
    "questionBody" TEXT NOT NULL,
    "questionPoints" INTEGER NOT NULL,
    "quizID" UUID NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" UUID NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "optionBody" TEXT NOT NULL,
    "questionID" UUID NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentAnswer" (
    "id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "optionId" UUID NOT NULL,
    "questionId" UUID NOT NULL,

    CONSTRAINT "studentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUid_key" ON "users"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_studentId_key" ON "enrollment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_classId_key" ON "enrollment"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "class_courseId_key" ON "class"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "courseReview_studentId_key" ON "courseReview"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "courseReview_courseId_key" ON "courseReview"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_lessonsId_key" ON "blog"("lessonsId");

-- CreateIndex
CREATE UNIQUE INDEX "video_lessonsId_key" ON "video"("lessonsId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_lessonsId_key" ON "quiz"("lessonsId");

-- CreateIndex
CREATE UNIQUE INDEX "question_quizID_key" ON "question"("quizID");

-- CreateIndex
CREATE UNIQUE INDEX "option_questionID_key" ON "option"("questionID");

-- CreateIndex
CREATE UNIQUE INDEX "studentAnswer_studentId_key" ON "studentAnswer"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "studentAnswer_optionId_key" ON "studentAnswer"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "studentAnswer_questionId_key" ON "studentAnswer"("questionId");

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseReview" ADD CONSTRAINT "courseReview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseReview" ADD CONSTRAINT "courseReview_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog" ADD CONSTRAINT "blog_lessonsId_fkey" FOREIGN KEY ("lessonsId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_lessonsId_fkey" FOREIGN KEY ("lessonsId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_lessonsId_fkey" FOREIGN KEY ("lessonsId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_quizID_fkey" FOREIGN KEY ("quizID") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAnswer" ADD CONSTRAINT "studentAnswer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAnswer" ADD CONSTRAINT "studentAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAnswer" ADD CONSTRAINT "studentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
