export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  appName: import.meta.env.VITE_APP_NAME || 'Campaign Management Dashboard',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_ENV || 'development',
  isDebug: import.meta.env.VITE_DEBUG === 'true',
  productionUrl: import.meta.env.VITE_PRODUCTION_URL || 'https://your-domain.com',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;