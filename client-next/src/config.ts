export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'ExoLayout',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '',
    title: process.env.NEXT_PUBLIC_APP_TITLE || 'ExoLayout',
    logo: process.env.NEXT_PUBLIC_APP_LOGO || '',
    splashLogo: process.env.NEXT_PUBLIC_APP_SPLASH_LOGO || '',
    favicon: process.env.NEXT_PUBLIC_APP_FAVICON || '/favicon.svg',
  },
  meta: {
    name: process.env.NEXT_PUBLIC_APP_META_NAME || '',
    description: process.env.NEXT_PUBLIC_APP_META_DESCRIPTION || '',
    title: process.env.NEXT_PUBLIC_APP_META_TITLE || '',
  },
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const
