/**
 * Environment Configuration
 * Manages environment variables for different deployment environments
 */

interface EnvironmentConfig {
  apiBaseUrl: string;
  apiVersion: string;
  environment: 'development' | 'staging' | 'production';
  enableLogging: boolean;
}

const getConfig = (): EnvironmentConfig => {
  const env = import.meta.env.MODE;

  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    apiVersion: import.meta.env.VITE_API_VERSION || 'v1',
    environment: env as any,
    enableLogging: env === 'development',
  };
};

export const config = getConfig();

export const getApiUrl = (path: string): string => {
  return `${config.apiBaseUrl}/api/${path}`;
};
