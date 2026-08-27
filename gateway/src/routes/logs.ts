import { Router, Request, Response } from 'express';
import { getLogs, getErrorLogs, getLogsFilePath } from '../config/logger';
import { logsAuth } from '../middleware/logsAuth';
import fs from 'fs';
import path from 'path';

const router = Router();

router.use(logsAuth);

router.get('/', (req: Request, res: Response) => {
  const lines = parseInt(req.query.lines as string) || 100;
  const type = (req.query.type as string) || 'combined';
  
  const logs = type === 'error' ? getErrorLogs(lines) : getLogs(lines);
  
  res.json({
    success: true,
    data: {
      service: 'gateway',
      type,
      count: logs.length,
      lines,
      logs
    },
    message: 'Fetched successfully'
  });
});

router.get('/download', (req: Request, res: Response) => {
  const type = (req.query.type as string) || 'combined';
  const logFile = type === 'error' 
    ? path.join(process.cwd(), 'logs', 'error.log')
    : getLogsFilePath();
  
  if (!fs.existsSync(logFile)) {
    res.status(404).json({ success: false, message: 'Log file not found' });
    return;
  }
  
  res.download(logFile, `${type}-gateway.log`);
});

export default router;
