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
