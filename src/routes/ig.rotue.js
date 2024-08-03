import { Router } from 'express';

import {
  loginHandler,
  logoutHandler,
  twoFactorVerificationHandler,
  unfollowHandler,
} from '../controllers/ig.controller.js';

const router = Router();

router.post('/login', loginHandler);
router.get('/logout', logoutHandler);

router.get('/two-factor', (_req, res) => {
  res.render('twoFactor');
});
router.post('/two-factor', twoFactorVerificationHandler);

router.get('/unfollow', (_req, res) => {
  res.render('unfollow');
});
router.post('/unfollow', unfollowHandler);

export default router;
