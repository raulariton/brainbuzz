import { Router } from 'express';
import { StatsController } from '../controllers/statsController.js';

const router = Router();

// GET /stats
router.get('/', StatsController.getStats);

export default router;
