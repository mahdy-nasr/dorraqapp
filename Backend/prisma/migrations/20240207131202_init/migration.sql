/*
  Warnings:

  - You are about to drop the column `courseId` on the `enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `lessonNumber` on the `enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `enrollment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enrollment" DROP COLUMN "courseId",
DROP COLUMN "description",
DROP COLUMN "lessonNumber",
DROP COLUMN "tag";
