import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";

const prisma = new PrismaClient();

export const validId = async (id) => {
  return prisma.files.findFirst({ where: { id: id } });
};

export const saveFile = async (id, password) => {
  try {
    await prisma.files.create({
      data: {
        id: id,
        password: await hashPassword(password),
      },
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
export const deleteFolder = async (id) => {
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
};
export const getHostedFiles = async (id) => {
  return prisma.files.findFirst({ where: { id: id } });
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(20);
  return bcrypt.hash(password.repeat(34), salt);
};

export const validatePassword = async (password, hash) => {
  return bcrypt.compare(password.repeat(34), hash);
};

// export const saveFiles = async (req, res, next) => {
