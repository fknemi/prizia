import crypto from 'crypto';
import { prisma } from './utils.js';
import { getCipherKey } from './encrypt.js';

const algo = 'aes-256-cbc';
const inVec = Buffer.from(process.env.IV, 'hex');
const secKey = Buffer.from(process.env.SECRET_KEY, 'hex');
const macKey = Buffer.from(process.env.MAC_KEY, 'hex');

export function generateToken(data, password) {
  try {
    // Convert data to JSON string if it's an object
    const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Encrypt the data
    const cipher = crypto.createCipheriv(algo, secKey, inVec);
    let encrypted = cipher.update(jsonData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Generate MAC for integrity verification
    const mac = crypto.createHmac('sha256', macKey).update(encrypted).digest('hex');
    
    return `${encrypted}:${mac}`;
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
}

export async function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') {
      return { id: null, password: null };
    }
    
    const parts = token.split(':');
    if (parts.length !== 2) {
      console.error('Invalid token format');
      return { id: null, password: null };
    }
    
    const [encrypted, mac] = parts;
    
    // Verify MAC
    const calculatedMac = crypto.createHmac('sha256', macKey).update(encrypted).digest('hex');
    if (calculatedMac !== mac) {
      console.error('MAC verification failed');
      return { id: null, password: null };
    }
    
    // Decrypt the token
    const decipher = crypto.createDecipheriv(algo, secKey, inVec);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Parse and return the data
    const parsed = JSON.parse(decrypted);
    return parsed;
  } catch (error) {
    console.error('Token verification error:', error);
    return { id: null, password: null };
  }
}

// Astro-compatible middleware function
export async function validateUser(context) {
  try {
    const { request, cookies, params } = context;
    const token = cookies.get('token')?.value;
    const { id } = params;
    
    if (!token || !id) {
      return { isValid: false, error: 'Missing token or ID' };
    }
    
    const tokenData = await verifyToken(token);
    if (!tokenData.id) {
      return { isValid: false, error: 'Invalid token' };
    }
    
    return { isValid: true, tokenData };
  } catch (error) {
    console.error('User validation error:', error);
    return { isValid: false, error: 'Validation failed' };
  }
}

// Express-style middleware (if still needed for backwards compatibility)
export async function validateUserExpress(req, res, next) {
  try {
    const token = req.headers.cookie?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    const { id } = req.params;
    
    if (!token || !id) {
      return res.status(401).send('Unauthorized');
    }
    
    const tokenData = await verifyToken(token);
    if (!tokenData.id) {
      return res.status(401).send('Unauthorized');
    }
    
    req.user = tokenData;
    next();
  } catch (error) {
    console.error('Express validation error:', error);
    return res.status(500).send('Internal Server Error');
  }
}

export async function isFileExpired(id) {
  try {
    if (!id) {
      console.error('No ID provided to isFileExpired');
      return false;
    }

    // First check if file exists with just the id
    let file = await prisma.file.findUnique({
      where: { id: id },
      select: { expiresAt: true }
    });

    // If not found, try different field names that might be used
    if (!file) {
      try {
        file = await prisma.file.findUnique({
          where: { uploadId: id },
          select: { expiresAt: true }
        });
      } catch (error) {
        // uploadId field doesn't exist, continue
      }
    }

    // If still not found, try with files table (plural)
    if (!file) {
      try {
        file = await prisma.files.findUnique({
          where: { id: id },
          select: { expiresAt: true }
        });
      } catch (error) {
        // files table doesn't exist, continue
      }
    }

    // If still not found, try with files table and uploadId
    if (!file) {
      try {
        file = await prisma.files.findUnique({
          where: { uploadId: id },
          select: { expiresAt: true }
        });
      } catch (error) {
        // This combination doesn't exist either
      }
    }

    if (!file) {
      console.error(`File not found with id: ${id}`);
      return false; // Return false instead of throwing error
    }

    if (!file.expiresAt) {
      console.log(`File ${id} has no expiration date`);
      return false; // File doesn't expire
    }

    const isExpired = file.expiresAt < new Date();
    console.log(`File ${id} expiration check: ${isExpired ? 'EXPIRED' : 'VALID'}`);
    return isExpired;

  } catch (error) {
    console.error('File expiration check error:', error);
    // Return false instead of throwing to prevent 500 errors
    return false;
  }
}
