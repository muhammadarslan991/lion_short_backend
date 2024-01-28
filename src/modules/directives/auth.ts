import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

import { UserTokenData } from '../../utils/types';
import RedisService from '../../db/redis/index';

config();

const secretKey = process.env.JWT as string;

if (!secretKey) {
  throw new Error('JWT secret key is not provided');
}

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

interface AuthenticatedRequest extends ExpressRequest {
  user?: UserTokenData; // Modify as per your UserTokenData type
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Check if the token is blacklisted
    const isBlacklisted = await RedisService.isTokenBlackList(token);

    if (isBlacklisted) {
      return res.status(403).json({ message: 'Token is blacklisted' });
    }

    const decoded = await verifyToken(token);

    if (!decoded.verify) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded;

    // Attach the decoded user information to the request object
    return next();
  } catch (err: any) {
    return res.status(403).json({ message: 'Failed to authenticate token', error: err.message });
  }
};
