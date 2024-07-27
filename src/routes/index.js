import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/heartbeat', (req, res) => {
  const hrtime = process.hrtime.bigint();

  res.status(200).json({ heartbeat: hrtime.toString() });
});

export default router;
