/*
  Warnings:

  - You are about to drop the column `fileUrls` on the `Files` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Files_fileUrls_key";

-- AlterTable
ALTER TABLE "Files" DROP COLUMN "fileUrls";
