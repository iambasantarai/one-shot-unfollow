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

router.get('/two-factor', (req, res) => {
  res.render('twoFactor', { message: req.flash('message') });
});
router.post('/two-factor', twoFactorVerificationHandler);

router.get('/unfollow', (req, res) => {
  res.render('unfollow', { message: req.flash('message') });
});
router.post('/unfollow', unfollowHandler);

export default router;
