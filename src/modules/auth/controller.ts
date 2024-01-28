import { Request, Response } from 'express';
import { resendVerification, signIn, signUp, verifyAccount } from './service';

import RedisService from '../../db/redis/index';

export default {
  signup: async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await signUp(body);
      return res.status(201).json(response);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        return res.status(500).json({ error: err });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  },
  signin: async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await signIn(body);
      return res.status(200).json(response);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  },

  verifyAccount: async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await verifyAccount(body);
      return res.status(200).json(response);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  },

  resend: async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await resendVerification(body.email);
      return res.status(200).json(response);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: 'Authorization header is required' });
      }

      // Extract the token from the authorization header
      const token = authorization.split(' ')[1];

      // Add the token to the blacklist
      await RedisService.addToBlackList(token);

      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};
