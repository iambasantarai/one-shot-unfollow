import { Router } from 'express';

const router = Router();

router.get('/heartbeat', (req, res) => {
  const hrtime = process.hrtime.bigint();
  res.status(200).json({ heartbeat: hrtime.toString() });
});

export default router;
