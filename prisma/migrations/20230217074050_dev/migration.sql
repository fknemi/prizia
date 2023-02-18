/*
  Warnings:

  - A unique constraint covering the columns `[uploadId]` on the table `Files` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "encryptedFileName" DROP NOT NULL,
ALTER COLUMN "lastDownloaded" DROP NOT NULL,
ALTER COLUMN "timesDownloaded" DROP NOT NULL,
ALTER COLUMN "expiresAt" DROP NOT NULL,
ALTER COLUMN "encryptedFileStoredPath" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Files" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Files_uploadId_key" ON "Files"("uploadId");
