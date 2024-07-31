import { Router } from 'express';

import { loginHandler, logoutHandler } from '../controllers/ig.controller.js';

const router = Router();

router.post('/login', loginHandler);
router.post('/logout', logoutHandler);

export default router;
