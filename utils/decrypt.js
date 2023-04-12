import crypto from "crypto";
import { getCipherKey, validateFile } from "./encrypt.js";
import fs from "fs";
export async function decrypt(filePath, password) {
  let encrypted = fs.readFileSync(filePath);
  password = getCipherKey(password);
  const iv = encrypted.slice(0, 16);
  encrypted = encrypted.slice(16);
  const decipher = crypto.createDecipheriv("aes-256-ctr", password, iv);
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return result;
}
