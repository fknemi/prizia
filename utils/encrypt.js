import crypto from "crypto";
import path from "path";
import fs from "fs";

import {
  audioFormats,
  videoFormats,
  imageFormats,
  compressImage,
  compressAudio,
  compressVideo,
} from "./compress.js";
import { prisma } from "./utils.js";

export function getCipherKey(password) {
  return crypto
    .createHash("sha256")
    .update(String(password))
    .digest() // Use binary digest
    .slice(0, 32); // Ensure the key is 32 bytes long
}

export async function validateFile(filePath, fileExtension) {
  let buffer = null;
  if (imageFormats.includes(fileExtension)) {
    buffer = await compressImage(filePath, fileExtension);
  } else if (audioFormats.includes(fileExtension)) {
    buffer = await compressAudio(filePath, fileExtension);
  } else if (videoFormats.includes(fileExtension)) {
    buffer = await compressVideo(filePath, fileExtension);
  }
  return buffer;
}

async function encrypt(filePath, password) {
  password = getCipherKey(password);
  let fileExtension = path.extname(filePath).substring(1);
  let buffer = await validateFile(filePath, fileExtension);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-ctr", password, iv);
  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return result;
}

export const encryptAllFiles = async (files, password, id) => {
  for (const file of files) {
    if (file.encryptedFileName || file.encryptedFileStoredPath) {
      continue;
    }
    let encryptedBuffer = await encrypt(file.fileStoredPath, password);
    if (!encryptedBuffer) {
      continue;
    }

    let fileExtension = path.extname(file.fileStoredPath).substring(1);
    let encryptedFileName = crypto.randomUUID();
    let encryptedFileStoredPath = `./${process.env.UPLOADS_FOLDER}/${id}/${encryptedFileName}.${fileExtension}`;
    fs.writeFileSync(encryptedFileStoredPath, encryptedBuffer);
    try {
      await prisma.file.update({
        where: {
          id: file.id,
        },
        data: {
          encryptedFileName: `${encryptedFileName}.${fileExtension}`,
          encryptedFileStoredPath: encryptedFileStoredPath,
        },
      });
    } catch (err) {
      console.log(err);
      continue;
    }
    try {
      await fs.promises.rm(file.fileStoredPath, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 1000,
      });
    } catch (err) {
      console.log(err);
      continue;
    }
  }
};
