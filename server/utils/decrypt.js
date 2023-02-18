import crypto from "crypto";
import fs from "fs";
import { getCipherKey } from "./encrypt.js";

export async function decrypt(filePath, password) {
  let buffer = fs.readFileSync(filePath);
  if (!buffer) {
    return;
  }
  const initVect = buffer.slice(0, 16);
  const CIPHER_KEY = getCipherKey(password);

  const decipher = crypto.createDecipheriv("aes256", CIPHER_KEY, initVect);
  decipher.setAutoPadding(false);
  decipher.setDefaultEncoding("base64");

  const decrypted = Buffer.from(
    decipher.update(buffer.slice(16)) + decipher.final()
  );

  const result = Buffer.from(decrypted);
  return result;
}
