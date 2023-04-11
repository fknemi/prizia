import { hashPassword } from "./hash.js";
import { PrismaClient } from "@prisma/client";

import fs from "fs";
export const prisma = new PrismaClient();

export async function validId(id) {
  return prisma.files.findFirst({ where: { uploadId: id } });
}

export async function saveFile(id, password, expiryTime) {
  // expiryTime is in the format of 1H, 1D, 1W

  // converting expiry time to date
  let expiryDate = new Date();
  let expiryTimeNumber = parseInt(expiryTime);
  let expiryTimeUnit = expiryTime.slice(-1);
  if (expiryTimeUnit === "H") {
    expiryDate.setHours(expiryDate.getHours() + expiryTimeNumber);
  } else if (expiryTimeUnit === "D") {
    expiryDate.setDate(expiryDate.getDate() + expiryTimeNumber);
  } else if (expiryTimeUnit === "W") {
    expiryDate.setDate(expiryDate.getDate() + expiryTimeNumber * 7);
  }

  try {
    let didUpdate = await prisma.files.update({
      where: {
        uploadId: id,
      },
      data: {
        password: await hashPassword(password),
        expiresAt: expiryDate,
      },
    });
    return didUpdate ? true : false;
  } catch (err) {
    console.log(err);
    return false;
  }
}
export async function deleteFolder(id) {
  try {
    await fs.promises.rm(`./${process.env.UPLOADS_FOLDER}/${id}`, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 1000,
    });
  } catch (err) {
    return err.code === "ENOENT";
  }
  return true;
}
export async function getHostedFiles(id) {
  return prisma.files.findUnique({
    where: { uploadId: id },
    include: { files: true },
  });
}

export async function compressFile(file) {
  let mz = new MiniZip();
  return new Promise((resolve, reject) => {
    zlib.deflate(file, (err, buffer) => {
      if (err) {
        return reject(err);
      }

      return resolve(mz.append("Hello", buffer, "lol"));
    });
  });
}
