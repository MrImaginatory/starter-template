import winston from 'winston';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, printf, colorize, json } = winston.format;

const LOGS_DIR = path.join(process.cwd(), 'logs');

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const isDev = process.env.NODE_ENV !== 'production';

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

const prodFormat = combine(
  timestamp(),
  json()
);

const fileFormat = combine(
  timestamp(),
  json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  format: isDev ? devFormat : prodFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: path.join(LOGS_DIR, 'error.log'), 
      level: 'error',
      format: fileFormat
    }),
    new winston.transports.File({ 
      filename: path.join(LOGS_DIR, 'combined.log'),
      format: fileFormat
    }),
  ],
});

export const createLogger = (module: string) => {
  return logger.child({ module });
};

export const getLogs = (lines = 100): string[] => {
  const logFile = path.join(LOGS_DIR, 'combined.log');
  if (!fs.existsSync(logFile)) return [];
  
  const content = fs.readFileSync(logFile, 'utf-8');
  const logLines = content.trim().split('\n').filter(line => line);
  return logLines.slice(-lines).reverse();
};

export const getLogsStream = () => {
  const logFile = path.join(LOGS_DIR, 'combined.log');
  return fs.createReadStream(logFile);
};

export const getLogsFilePath = (): string => {
  return path.join(LOGS_DIR, 'combined.log');
};

export const getErrorLogs = (lines = 100): string[] => {
  const logFile = path.join(LOGS_DIR, 'error.log');
  if (!fs.existsSync(logFile)) return [];
  
  const content = fs.readFileSync(logFile, 'utf-8');
  const logLines = content.trim().split('\n').filter(line => line);
  return logLines.slice(-lines).reverse();
};

export default logger;
