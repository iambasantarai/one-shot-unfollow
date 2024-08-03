import { Router } from 'express';
import igRoutes from './ig.rotue.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('index', { info: req.flash('info') });
});

router.get('/heartbeat', (req, res) => {
  const hrtime = process.hrtime.bigint();

  res.status(200).json({ heartbeat: hrtime.toString() });
});

router.use('/ig', igRoutes);

export default router;
