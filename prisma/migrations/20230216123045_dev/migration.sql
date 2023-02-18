/*
  Warnings:

  - You are about to drop the column `filesId` on the `File` table. All the data in the column will be lost.
  - Added the required column `uploadId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadId` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_filesId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "filesId",
ADD COLUMN     "uploadId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "uploadId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
