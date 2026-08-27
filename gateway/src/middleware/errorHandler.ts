import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Gateway error', { error: err.message, path: req.path });
  res.status(500).json({
    success: false,
    message: 'Internal gateway error',
  });
};
