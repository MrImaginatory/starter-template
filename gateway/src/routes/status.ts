import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  
  let backendStatus = 'unknown';
  try {
    const response = await fetch(`${backendUrl}/backend/health`, { 
      signal: AbortSignal.timeout(5000) 
    });
    backendStatus = response.ok ? 'connected' : 'error';
  } catch {
    backendStatus = 'disconnected';
  }
  
  res.json({
    success: true,
    data: {
      service: 'gateway',
      status: 'running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      backend: {
        url: backendUrl,
        status: backendStatus
      },
      env: process.env.NODE_ENV || 'development'
    },
    message: 'Fetched successfully'
  });
}));

export default router;
