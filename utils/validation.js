import crypto from "crypto";
import { prisma } from "./utils.js";
const algo = "aes-256-cbc";
const inVec = Buffer.from(process.env.IV, "hex");
const secKey = Buffer.from(process.env.SECRET_KEY, "hex");
const macKey = Buffer.from(process.env.MAC_KEY, "hex");

export async function generateToken(id, password) {
  const cipherText = crypto.createCipheriv(algo, secKey, inVec);
  let encryptedData = cipherText.update(
    JSON.stringify({ id: id, password: password }),
    "utf-8",
    "hex"
  );
  encryptedData += cipherText.final("hex");

  const hmac = crypto.createHmac("sha256", macKey);
  hmac.update(encryptedData);
  const mac = hmac.digest("hex");

  return `${encryptedData}:${mac}`;
}

export async function verifyToken(token) {
  const [encryptedData, mac] = token.split(":");
  const hmac = crypto.createHmac("sha256", macKey);
  hmac.update(encryptedData);
  const calculatedMac = hmac.digest("hex");

  if (calculatedMac !== mac) {
    console.log("MAC Verification Failed");
    return {
      id: null,
      password: null,
    };
  }

  const decipher = crypto.createDecipheriv(algo, secKey, inVec);
  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");

  return JSON.parse(decryptedData);
}

export async function validateUser(req, res, next) {
  let token = req.headers.cookie.replace("token=", "");
  let id = req.params.id;

  if (!token || !id) {
    return res.status(401).send("Unauthorized");
  }
  let isValid = await verifyToken(token);
  if (!isValid) {
    return res.status(401).send("Unauthorized");
  }

  next();
}

export async function isFileExpired(id) {
  const data = await prisma.files.findFirst({
    where: {
      uploadId: id,
    },
  });
  return data.expiresAt < new Date();
}
