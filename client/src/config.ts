export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Starter Kit',
    description: import.meta.env.VITE_APP_DESCRIPTION || '',
    title: import.meta.env.VITE_APP_TITLE || 'Starter Kit',
    logo: import.meta.env.VITE_APP_LOGO || '',
    splashLogo: import.meta.env.VITE_APP_SPLASH_LOGO || '',
    favicon: import.meta.env.VITE_APP_FAVICON || '/favicon.svg',
  },
  meta: {
    name: import.meta.env.VITE_APP_META_NAME || '',
    description: import.meta.env.VITE_APP_META_DESCRIPTION || '',
    title: import.meta.env.VITE_APP_META_TITLE || '',
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
