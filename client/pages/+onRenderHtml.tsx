export { onRenderHtml }

import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape, type OnRenderHtmlAsync } from 'vike/server'
import { organizationSchema } from '@/components/seo/organization-schema'

const SITE_TITLE = 'ExoLayout'
const SITE_DESCRIPTION =
  'A production-ready React component library — built with Radix UI, Tailwind CSS v4, and modern best practices.'
const SITE_URL = 'https://exolayout.dev'
const OG_IMAGE = `${SITE_URL}/og-default.png`

const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const { Page } = pageContext

  const pageHtml = Page ? renderToString(<Page />) : ''

  return escapeInject`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageContext.title ?? SITE_TITLE}</title>
    <meta name="description" content="${pageContext.description ?? SITE_DESCRIPTION}" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafafa" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09090b" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href="${SITE_URL}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}" />
    <meta property="og:title" content="${SITE_TITLE}" />
    <meta property="og:description" content="${SITE_DESCRIPTION}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="ExoLayout" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${SITE_URL}" />
    <meta name="twitter:title" content="${SITE_TITLE}" />
    <meta name="twitter:description" content="${SITE_DESCRIPTION}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <!-- Structured Data -->
    <script type="application/ld+json">${dangerouslySkipEscape(JSON.stringify(organizationSchema))}</script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <script>
      ;(function () {
        try {
          var stored = localStorage.getItem('starter-kit-theme')
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          var dark = stored === 'dark' || ((stored === null || stored === 'system') && prefersDark)
          document.documentElement.classList.toggle('dark', dark)
        } catch (e) {}
      })()
    </script>
  </head>
  <body class="min-h-full flex flex-col">
    <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
  </body>
</html>`
}
