import logger from './logger';

export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value && defaultValue !== undefined) return defaultValue;
  if (!value) throw new Error(`Environment variable ${key} is not set`);
  const num = Number(value);
  if (isNaN(num)) throw new Error(`Environment variable ${key} is not a valid number`);
  return num;
};

export const validateEnv = (): void => {
  const required = ['BACKEND_URL', 'GATEWAY_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { variables: missing });
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  logger.info('Gateway environment validated');
};
