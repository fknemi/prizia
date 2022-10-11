import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const IMAGEKIT_API_ENDPOINT = "https://api.imagekit.io/v1";

const prisma = new PrismaClient();

export const validId = async (id) => {
  return prisma.files.findFirst({ where: { id: id } });
};

export const createFolder = async (folderName) => {
  try {
    const req = await axios.post(
      `${IMAGEKIT_API_ENDPOINT}/folder`,
      {
        folderName: folderName,
        parentFolderPath: "Prizia",
      },
      {
        headers: {
          Authorization: `Basic ${process.env.IMAGEKIT_API_PRIVATE_KEY}`,
        },
      }
    );

    return Object.keys(req.data) === 0;
  } catch {
    return false;
  }
};

export const deleteFolder = async (folderName) => {
  try {
    const req = await axios.delete(
      `${IMAGEKIT_API_ENDPOINT}/folder`,
      {
        folderPath: `Prizia/${folderName}`,
      },
      {
        headers: {
          Authorization: `Basic ${process.env.IMAGEKIT_API_PRIVATE_KEY}`,
        },
      }
    );

    return req.status === 200;
  } catch {
    return false;
  }
};

export const getHostedFiles = async (id) => {
  return prisma.files.findFirst({ where: { id: id } });
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(20);
  return bcrypt.hash(this.password.repeat(34), salt);
};
export const validatePassword = async (password, hash) => {
  return bcrypt.compare(password.repeat(34), hash);
};
