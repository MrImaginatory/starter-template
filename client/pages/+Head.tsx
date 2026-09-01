export { Head }

import { useConfig } from 'vike-react/useConfig'
import { organizationSchema } from '@/components/seo/organization-schema'

function Head() {
  const config = useConfig()

  const title = 'ExoLayout'
  const description =
    'A production-ready React component library — built with Radix UI, Tailwind CSS v4, and modern best practices.'
  const siteUrl = 'https://exolayout.dev'
  const ogImage = `${siteUrl}/og-default.png`

  config({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },

      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: siteUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'ExoLayout' },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: siteUrl },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    link: [
      { rel: 'canonical', href: siteUrl },
    ],
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}
