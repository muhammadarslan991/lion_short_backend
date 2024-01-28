import { Request, Response } from 'express';
import { AuthenticatedRequest } from './interface';

export default {
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
