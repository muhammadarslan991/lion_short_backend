import { Request, Response } from 'express';
import { resendVerification, signIn, signUp, verifyAccount } from './service';

import { AuthenticatedRequest } from './interface';

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

  profile: async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Implement your getUserProfile logic
      const { user } = req; // Assuming you have user information in the request
      return res.status(200).json(user);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
};
