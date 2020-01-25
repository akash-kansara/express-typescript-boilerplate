import { Router } from 'express';

import { create, fetch } from './api';

const router = Router();

router.post('/post', create);
router.get('/', fetch);

export default router;