-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,
    "encryptedFileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileStoredPath" TEXT NOT NULL,
    "lastDownloaded" TIMESTAMP(3) NOT NULL,
    "timesDownloaded" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "filesId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_filesId_fkey" FOREIGN KEY ("filesId") REFERENCES "Files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
