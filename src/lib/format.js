const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

export function ageFrom(iso, today = new Date()) {
  const [y, m, d] = iso.split('-').map(Number)
  let age = today.getFullYear() - y
  const before =
    today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)
  if (before) age -= 1
  return Math.max(age, 0)
}

export function ageLabel(iso) {
  const age = ageFrom(iso)
  if (age >= 1) return `${age} yr${age === 1 ? '' : 's'}`
  const [y, m] = iso.split('-').map(Number)
  const now = new Date()
  const months = Math.max((now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m), 0)
  return `${months} mo`
}

export const initials = (c) => `${c.first_name[0] ?? ''}${c.last_name[0] ?? ''}`.toUpperCase()

// Stable hue per citizen so avatars look varied but stay calm.
export function avatarTone(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360
  return h
}

export const nf = new Intl.NumberFormat('en-NG')
