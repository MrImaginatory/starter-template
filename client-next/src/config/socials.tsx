import type { ComponentType, SVGProps } from 'react'
import { GithubIcon, InstagramIcon, LinkedinIcon, RedditIcon, XIcon } from '@/components/icons/social-icons'

type IconProps = SVGProps<SVGSVGElement>

export interface SocialLink {
  platform: string
  label: string
  url: string
  icon: ComponentType<IconProps>
}

export const socials: SocialLink[] = [
  { platform: 'github', label: 'GitHub', url: 'https://github.com/MrImaginatory/exolayout', icon: GithubIcon },
  { platform: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/mr.imaginatory', icon: InstagramIcon },
  { platform: 'reddit', label: 'Reddit', url: 'https://www.reddit.com/user/Mr_Imaginatory/', icon: RedditIcon },
  { platform: 'x', label: 'X', url: 'https://x.com/mr_imaginatory', icon: XIcon },
  { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/prabhat-sharma-501ab12a9/', icon: LinkedinIcon },
]
