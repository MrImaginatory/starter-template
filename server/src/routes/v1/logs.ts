import { Router, Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { MESSAGES } from '../../utils/messages';
import { getLogs, getErrorLogs, getLogsFilePath } from '../../utils/logger';
import { asyncHandler } from '../../middleware/errorHandler';
import { logsAuth } from '../../middleware/logsAuth';
import fs from 'fs';
import path from 'path';

const router = Router();

router.use(logsAuth);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const lines = parseInt(req.query.lines as string) || 100;
  const type = (req.query.type as string) || 'combined';
  
  const logs = type === 'error' ? getErrorLogs(lines) : getLogs(lines);
  
  sendSuccess(res, {
    service: 'backend',
    type,
    count: logs.length,
    lines,
    logs
  }, MESSAGES.SUCCESS.FETCHED);
}));

router.get('/download', asyncHandler(async (req: Request, res: Response) => {
  const type = (req.query.type as string) || 'combined';
  const logFile = type === 'error' 
    ? path.join(process.cwd(), 'logs', 'error.log')
    : getLogsFilePath();
  
  if (!fs.existsSync(logFile)) {
    sendError(res, 'Log file not found', 404);
    return;
  }
  
  res.download(logFile, `${type}-backend.log`);
}));

export default router;
