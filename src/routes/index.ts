import { Router } from 'express';

import { authorize } from '../middleware/auth';

import authRouter from './auth';
import mdmRouter from './mdm';
import salesRouter from './sales';

const router = Router();

router.use('/auth', authRouter);
router.use('/mdm', authorize, mdmRouter);
router.use('/sales', authorize, salesRouter);

export default router;