import { useEffect, useState } from 'react'

export function useActiveSection(idsKey: string) {
  const [activeId, setActiveId] = useState<string>(() => idsKey.split(' ')[0] ?? '')

  useEffect(() => {
    const ids = idsKey.split(' ').filter(Boolean)
    if (ids.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-15% 0px -75% 0px' },
    )

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [idsKey])

  return activeId
}
