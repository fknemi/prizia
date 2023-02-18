/*
  Warnings:

  - Added the required column `encryptedFileStoredPath` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "encryptedFileStoredPath" TEXT NOT NULL;
