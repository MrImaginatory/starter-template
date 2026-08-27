import rateLimit from 'express-rate-limit';
import { MESSAGES } from '../utils/messages';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: MESSAGES.ERROR.RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: MESSAGES.ERROR.RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
});

export const createCustomLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: MESSAGES.ERROR.RATE_LIMIT,
    standardHeaders: true,
    legacyHeaders: false,
  });
};
