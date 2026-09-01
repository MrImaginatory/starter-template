export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\p{L}+/gu, (word) => capitalize(word))
}

export function truncate(text: string, maxLength: number, ellipsis = '…'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, Math.max(0, maxLength - 1)).trimEnd() + ellipsis
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function kebabToTitle(text: string): string {
  return capitalizeWords(text.replace(/[-_]+/g, ' '))
}
