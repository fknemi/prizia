import { randomBytes } from "crypto";

// Generate a 16-byte (128-bit) random initialization vector
const iv = randomBytes(16);

// Generate a 32-byte (256-bit) random secret key
const secretKey = randomBytes(32);

// Generate a 32-byte (256-bit) random MAC key
const macKey = randomBytes(32);

console.log(iv.toString("hex"));
console.log(secretKey.toString("hex"));
console.log(macKey.toString("hex"));
