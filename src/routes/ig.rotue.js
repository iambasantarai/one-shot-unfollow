import { Router } from 'express';

import { loginHandler, logoutHandler } from '../controllers/ig.controller.js';

const router = Router();

router.get('/two-factor', (req, res) => {
  res.render('twoFactor');
});

router.get('/unfollow', (req, res) => {
  res.render('unfollow');
});

router.post('/login', loginHandler);
router.post('/logout', logoutHandler);

export default router;
