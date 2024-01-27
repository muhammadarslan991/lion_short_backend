import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { config } from 'dotenv';

config();

import { UserTokenData } from '../../utils/types';

// Define your secret key
const secretKey = process.env.JWT as string;
// Ensure the secret key is provided

if (!secretKey) {
  throw new Error('JWT secret key is not provided');
}

// Define a function to verify JWT token
function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

// Define an interface extending Express's Request interface to include the user property
interface AuthenticatedRequest extends ExpressRequest {
  user?: UserTokenData; // Modify 'any' to match the type of your user object
}

// Middleware function to authenticate requests
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = await verifyToken(token);

    if (!decoded.verify) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;

    // Attach the decoded user information to the request object
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Failed to authenticate token', err });
  }
};
