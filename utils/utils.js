import * as dotenv from "dotenv";
dotenv.config();
import { hashPassword } from "./hash";
import { PrismaClient } from "@prisma/client";

import fs from "fs";
export const prisma = new PrismaClient();

export async function validId(id) {
  return prisma.files.findFirst({ where: { uploadId: id } });
}

export async function saveFile(id, password) {
  try {
    let didUpdate = await prisma.files.update({
      where: {
        uploadId: id,
      },
      data: {
        password: await hashPassword(password),
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
