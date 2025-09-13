-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,
    "encryptedFileName" TEXT,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileStoredPath" TEXT NOT NULL,
    "encryptedFileStoredPath" TEXT,
    "lastDownloaded" TIMESTAMP(3),
    "timesDownloaded" INTEGER,
    "expiresAt" TIMESTAMP(3),
    "uploadId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Files_id_key" ON "Files"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Files_uploadId_key" ON "Files"("uploadId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
