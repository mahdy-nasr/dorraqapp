/*
  Warnings:

  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "gender" VARCHAR(10) NOT NULL;
