import cron from "node-cron";
import { prisma } from "../utils/utils.js";
import fs from "fs";

export const expiredFilesDeletionJob = cron.schedule("0 0 * * *", async () => {
  const expiredFiles = await prisma.files.findMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
    select: {
      uploadId: true,
      id: true,
    },
  });

  if (expiredFiles.length == 0) {
    return console.log("NO EXPIRED FILES FOUND");
  }

  expiredFiles.forEach(async (file) => {
    try {
      fs.rm(`./uploads/${file.uploadId}`, { recursive: true });
    } catch (err) {
      console.log(err);
      console.log(`FAILED TO DELETE FOLDER: ${file.uploadId}`);
    }
  });
  const fileIds = expiredFiles.map((file) => file.id);
  const uploadIds = expiredFiles.map((file) => file.uploadId);
  try {
    await prisma.file.deleteMany({
      where: {
        uploadId: {
          in: fileIds,
        },
      },
    });
  } catch {}
  try {
    await prisma.files.deleteMany({
      where: {
        uploadId: {
          in: uploadIds,
        },
      },
    });
  } catch (err) {
    console.log(err);
    console.log(
      `FAILED TO DELETE EXPIRED FILES: ${
        uploadIds.length > 1 ? uploadIds.join(", ") : uploadIds[0]
      }`
    );
  }
});

export const corruptedFilesDeletionJob = cron.schedule(
  "0 0 * * *",
  async () => {
    const files = await prisma.files.findMany({
      include: {
        files: true,
      },
    });

    files.forEach(async (hostedFiles) => {
      // check if password is null and created at is more than 24 hours ago
      if (
        hostedFiles.password == null &&
        hostedFiles.createdAt < new Date(Date.now() - 86400000)
      ) {
        fs.rm(`./uploads/${hostedFiles.uploadId}`, { recursive: true });
      }

      fs.readdir(`./uploads/${hostedFiles.uploadId}`, (err, foundFiles) => {
        if (err) {
          console.log(err);
          return;
        }
        // check if file is older than 12 hours
        if (hostedFiles.createdAt < new Date(Date.now() - 43200000)) return;
        for (let fileFound of foundFiles) {
          const encryptedFiles = hostedFiles.files.map(
            (file) => file.encryptedFileName
          );
          if (!encryptedFiles.includes(fileFound)) {
            fs.rm(
              `./${process.env.UPLOADS_FOLDER}/${file.uploadId}/${fileFound}`,
              { recursive: true }
            );
            console.log(`DELETED CORRUPTED FILE: ${fileFound}`);
          }
        }
      });
    });
    console.log("RAN CORRUPTED FILES DELETION JOB");
  }
);
