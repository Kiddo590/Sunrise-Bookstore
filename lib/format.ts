export const money = (n: number) =>
  `KSh ${n.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
