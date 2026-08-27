import { Router } from 'express';
import healthRoutes from './health';
import logRoutes from './logs';
import statusRoutes from './status';
import { logsAuth } from '../../middleware/logsAuth';

const router = Router();

router.use(healthRoutes);
router.use('/logs', logsAuth, logRoutes);
router.use('/status', statusRoutes);

export default router;
