/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_META_NAME: string
  readonly VITE_APP_META_DESCRIPTION: string
  readonly VITE_APP_META_TITLE: string
  readonly VITE_APP_LOGO: string
  readonly VITE_APP_SPLASH_LOGO: string
  readonly VITE_APP_FAVICON: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
