import { Request as ExpressRequest } from 'express';
import { UserTokenData } from '../../utils/types';

// Define an interface extending Express's Request interface to include the user property
export interface AuthenticatedRequest extends ExpressRequest {
  user?: UserTokenData; // Modify 'any' to match the type of your user object
}
