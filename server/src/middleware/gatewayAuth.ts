import { Request, Response, NextFunction } from 'express';
import { getEnv } from '../config/env';
import { sendError } from '../utils/response';
import { MESSAGES } from '../utils/messages';
import { createLogger } from '../utils/logger';

const log = createLogger('GatewayAuth');

export const gatewayAuth = (req: Request, res: Response, next: NextFunction): void => {
  const gatewaySecret = req.headers['x-gateway-secret'];
  const expectedSecret = getEnv('GATEWAY_SECRET');

  if (!gatewaySecret || gatewaySecret !== expectedSecret) {
    log.warn('Request rejected: Invalid or missing gateway secret', {
      ip: req.ip,
      path: req.path,
    });
    sendError(res, MESSAGES.ERROR.FORBIDDEN, 403);
    return;
  }

  next();
};

export const isGatewayRequest = (req: Request): boolean => {
  const gatewaySecret = req.headers['x-gateway-secret'];
  const expectedSecret = process.env.GATEWAY_SECRET;
  return gatewaySecret === expectedSecret;
};
