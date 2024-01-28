import express from 'express';

import Controller from './controller';

import { authMiddleware } from '../directives/auth';

const router = express.Router();

router.get('/profile', authMiddleware, Controller.profile);

export default router;
