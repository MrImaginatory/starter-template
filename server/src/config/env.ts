import logger from '../utils/logger';

interface EnvConfig {
  [key: string]: {
    required: boolean;
    default?: string;
    validation?: (value: string) => boolean;
    errorMessage?: string;
  };
}

const envSchema: EnvConfig = {
  NODE_ENV: {
    required: false,
    default: 'development',
    validation: (value) => ['development', 'production', 'test'].includes(value),
    errorMessage: 'NODE_ENV must be development, production, or test',
  },
  PORT: {
    required: false,
    default: '5000',
    validation: (value) => !isNaN(Number(value)) && Number(value) > 0,
    errorMessage: 'PORT must be a positive number',
  },
  LOG_LEVEL: {
    required: false,
    default: 'info',
    validation: (value) => ['error', 'warn', 'info', 'debug'].includes(value),
    errorMessage: 'LOG_LEVEL must be error, warn, info, or debug',
  },
  DB_PROVIDER: {
    required: true,
    validation: (value) => ['postgresql', 'mysql'].includes(value),
    errorMessage: 'DB_PROVIDER must be postgresql or mysql',
  },
  DATABASE_URL: {
    required: true,
    errorMessage: 'DATABASE_URL is required',
  },
  JWT_SECRET: {
    required: true,
    errorMessage: 'JWT_SECRET is required',
  },
  JWT_LIFESPAN: {
    required: false,
    default: '1d',
    errorMessage: 'JWT_LIFESPAN must be a valid jsonwebtoken expiresIn value (e.g. "1d", "7d", "24h")',
  },
  REDIS_URL: {
    required: false,
    default: 'redis://localhost:6379',
  },
  LOGS_PASSWORD: {
    required: false,
    default: 'admin123',
  },
};

export const validateEnv = (): void => {
  const log = logger.child({ module: 'EnvValidator' });
  const missingRequired: string[] = [];
  const invalidValues: string[] = [];

  for (const [key, config] of Object.entries(envSchema)) {
    const value = process.env[key];

    if (!value && config.required) {
      missingRequired.push(key);
      continue;
    }

    if (!value && config.default) {
      process.env[key] = config.default;
      log.debug(`Using default value for ${key}: ${config.default}`);
      continue;
    }

    if (value && config.validation && !config.validation(value)) {
      invalidValues.push(config.errorMessage || `${key} is invalid`);
    }
  }

  if (missingRequired.length > 0) {
    log.error('Missing required environment variables', { variables: missingRequired });
    throw new Error(`Missing required environment variables: ${missingRequired.join(', ')}`);
  }

  if (invalidValues.length > 0) {
    log.error('Invalid environment variables', { errors: invalidValues });
    throw new Error(`Invalid environment variables:\n${invalidValues.join('\n')}`);
  }

  log.info('Environment variables validated successfully');
};

export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value && defaultValue !== undefined) {
    return defaultValue;
  }
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} is not a valid number`);
  }
  return num;
};

export const getEnvBoolean = (key: string, defaultValue = false): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};
