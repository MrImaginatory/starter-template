import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { sendError } from '../utils/response';
import { MESSAGES } from '../utils/messages';
import { AppError, ValidationError } from '../utils/errors';

const log = createLogger('ErrorHandler');

import { createLogger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ValidationError) {
    log.warn(`Validation error: ${err.message}`, { errors: err.errors, path: req.path });
    sendError(res, err.message, err.statusCode, JSON.stringify(err.errors));
    return;
  }

  if (err instanceof AppError) {
    log.warn(`App error: ${err.message}`, { statusCode: err.statusCode, path: req.path });
    sendError(res, err.message, err.statusCode);
    return;
  }

  log.error('Unexpected error', { error: err.message, stack: err.stack, path: req.path });
  sendError(res, MESSAGES.ERROR.INTERNAL, 500);
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
