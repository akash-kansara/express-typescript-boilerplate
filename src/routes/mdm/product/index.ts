import { Router } from 'express';

import { create, fetch, update } from './api';

const router = Router();

router.post('/', create);
router.get('/', fetch);
router.put('/', update);

export default router;