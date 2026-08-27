import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger';

const log = createLogger('Timeout');

const TIMEOUT_MS = 30000;

export const requestTimeout = (req: Request, res: Response, next: NextFunction): void => {
  req.setTimeout(TIMEOUT_MS, () => {
    if (!res.headersSent) {
      log.warn('Request timed out', { path: req.path, method: req.method });
      res.status(408).json({
        success: false,
        message: 'Request timeout',
      });
    }
  });

  res.setTimeout(TIMEOUT_MS, () => {
    if (!res.headersSent) {
      log.warn('Response timed out', { path: req.path, method: req.method });
      res.status(504).json({
        success: false,
        message: 'Gateway timeout',
      });
    }
  });

  res.on('finish', () => {
    req.setTimeout(0);
    res.setTimeout(0);
  });

  next();
};
