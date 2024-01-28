import express from 'express';

import Controller from './controller';

import validate from './validator';
import { authMiddleware } from '../directives/auth';

const router = express.Router();

router.post('/signup', validate.SignupValidator, Controller.signup);
router.post('/signin', validate.SigninValidator, Controller.signin);
router.post('/verify-accout', validate.VerifyValidator, Controller.verifyAccount);
router.post('/resend-otp', validate.ResendValidator, Controller.resend);
router.get('/logout', authMiddleware, Controller.logout);

export default router;
