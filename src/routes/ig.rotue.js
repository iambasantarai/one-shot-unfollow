import { Router } from 'express';

import {
  loginHandler,
  logoutHandler,
  unfollowHandler,
} from '../controllers/ig.controller.js';

const router = Router();

router.post('/login', loginHandler);
router.get('/logout', logoutHandler);

router.get('/two-factor', (_req, res) => {
  res.render('twoFactor');
});

router.get('/unfollow', (_req, res) => {
  res.render('unfollow');
});
router.post('/unfollow', unfollowHandler);

export default router;
