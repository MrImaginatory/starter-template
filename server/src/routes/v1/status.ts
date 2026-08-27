import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import { MESSAGES } from '../../utils/messages';
import { asyncHandler } from '../../middleware/errorHandler';
import { getDB } from '../../config/database';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let dbProvider = process.env.DB_PROVIDER || 'postgresql';
  
  try {
    const db = getDB();
    await db.$queryRaw`SELECT 1 as status`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }
  
  sendSuccess(res, {
    service: 'backend',
    status: 'running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      provider: dbProvider,
      status: dbStatus
    },
    env: process.env.NODE_ENV || 'development'
  }, MESSAGES.SUCCESS.FETCHED);
}));

export default router;
