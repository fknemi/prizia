/*
  Warnings:

  - Added the required column `password` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "password" TEXT NOT NULL;
