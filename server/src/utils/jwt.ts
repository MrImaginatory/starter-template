import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';

export interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const JWT_SECRET = getEnv('JWT_SECRET');
const JWT_LIFESPAN = getEnv('JWT_LIFESPAN', '1d');
const REFRESH_LIFESPAN = '7d';

export const generateToken = (payload: JwtPayload, expiresIn?: string): string => {
  const options: jwt.SignOptions = { expiresIn: expiresIn || JWT_LIFESPAN } as jwt.SignOptions;
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateTokenPair = (payload: JwtPayload): TokenPair => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_LIFESPAN,
  } as jwt.SignOptions);
  const refreshToken = jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_LIFESPAN,
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
};

export const verifyToken = <T extends object = JwtPayload>(token: string): T => {
  return jwt.verify(token, JWT_SECRET) as T;
};

export const decodeToken = (token: string): string | jwt.JwtPayload | null => {
  return jwt.decode(token);
};
