import jwt, { Secret } from 'jsonwebtoken';
import { UserTokenData } from './types';

const secretKey = process.env.JWT as string;

console.log('secretKeysecretKeysecretKey', secretKey);

export const generateToken = (data: UserTokenData): string => {
  return jwt.sign(
    data,
    secretKey, // Replace with your actual secret key
    { expiresIn: '1h' } // Token expiration time
  );
};

export const generateRandomCode = (): number => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
