export function formatDate(iso, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', options)
}

export function formatDateShort(iso) {
  return formatDate(iso, { day: '2-digit', month: 'short' })
}

export function isOverdue(iso) {
  if (!iso) return false
  return new Date(iso) < new Date()
}

export function isDueSoon(iso, days = 3) {
  if (!iso) return false
  const diff = new Date(iso) - new Date()
  return diff >= 0 && diff < days * 24 * 60 * 60 * 1000
}

export function formatRelativeTime(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60)  return 'à l\'instant'
  const m = Math.floor(s / 60)
  if (m < 60)  return `il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24)  return `il y a ${h} h`
  const d = Math.floor(h / 24)
  return `il y a ${d} j`
}
