import express from 'express';

import AuthRouter from '../modules/auth/router';
import UserRouter from '../modules/user/router';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);

export default router;
