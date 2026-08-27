import { Request, Response, NextFunction } from 'express';
import { getEnv } from '../config/env';
import logger from '../config/logger';

export const logsAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    logger.warn('Logs access attempted without auth', { ip: req.ip, path: req.path });
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  const expectedToken = Buffer.from(getEnv('LOGS_PASSWORD', 'admin123')).toString('base64');
  
  if (token !== expectedToken) {
    logger.warn('Logs access attempted with invalid password', { ip: req.ip, path: req.path });
    res.status(401).json({ success: false, message: 'Invalid password' });
    return;
  }
  
  next();
};
