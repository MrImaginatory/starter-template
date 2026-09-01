import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  extends: [vikeReact],
  prerender: true,
  title: 'ExoLayout',
  description:
    'A production-ready React component library — built with Radix UI, Tailwind CSS v4, and modern best practices.',
} satisfies Config
