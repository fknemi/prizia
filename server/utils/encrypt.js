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
  return crypto.createHash("sha256").update(password).digest();
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
  const initVect = crypto.randomBytes(16);
  const CIPHER_KEY = getCipherKey(password);
  let fileExtension = path.extname(filePath).substring(1);
  let buffer = await validateFile(filePath, fileExtension);

  if (!buffer) {
    return;
  }

  const cipher = crypto.createCipheriv("aes256", CIPHER_KEY, initVect);
  cipher.setDefaultEncoding("base64");
  const encrypted = Buffer.from(cipher.update(buffer) + cipher.final());
  const result = Buffer.concat([initVect, encrypted]).toString("base64");
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
