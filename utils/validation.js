import crypto from 'crypto';
import { prisma } from './utils.js';
import { getCipherKey } from './encrypt.js';
const algo = 'aes-256-cbc';
const inVec = Buffer.from(process.env.IV, 'hex');
const secKey = Buffer.from(process.env.SECRET_KEY, 'hex');
const macKey = Buffer.from(process.env.MAC_KEY, 'hex');

export function generateToken(data, password) {
  const key = getCipherKey(password); // Ensure this returns a 32-byte buffer
  const iv = crypto.randomBytes(16); // Generate a 16-byte IV

  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

export async function verifyToken(token) {
  const [encrypted, mac] = token.split(':');
  const calculatedMac = crypto.createHmac('sha256', macKey).update(encrypted).digest('hex');

  if (calculatedMac !== mac) {
    console.error('MAC verification failed.');
    return { id: null, password: null };
  }

  const decipher = crypto.createDecipheriv(algo, secKey, inVec);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

export async function validateUser(req, res, next) {
  const token = req.headers.cookie?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  const { id } = req.params;

  if (!token || !id) {
    return res.status(401).send('Unauthorized');
  }

  const isValid = await verifyToken(token);
  if (!isValid.id) {
    return res.status(401).send('Unauthorized');
  }

  next();
}

export async function isFileExpired(id) {
  const file = await prisma.files.findUnique({
    where: { uploadId: id },
  });

  if (!file) {
    throw new Error('File not found');
  }

  return file.expiresAt < new Date();
}