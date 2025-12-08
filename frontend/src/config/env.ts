/**
 * Environment Configuration
 * Centralized configuration for environment variables
 */

export const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    env: import.meta.env.MODE || 'development',
} as const;
