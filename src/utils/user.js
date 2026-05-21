export function getUserFullName(user) {
  if (!user) return ''
  if (user.firstname || user.name) return [user.firstname, user.name].filter(Boolean).join(' ')
  return ''
}
