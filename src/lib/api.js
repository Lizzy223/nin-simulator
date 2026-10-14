import { supabase } from './supabase'
import { generateCitizens } from './generator'

export const SORTS = {
  name_asc: { label: 'Surname A–Z', column: 'last_name', ascending: true },
  name_desc: { label: 'Surname Z–A', column: 'last_name', ascending: false },
  dob_asc: { label: 'Oldest first', column: 'date_of_birth', ascending: true },
  dob_desc: { label: 'Youngest first', column: 'date_of_birth', ascending: false },
}

// ---------- Supabase (REST endpoint: /rest/v1/citizens) ----------

async function sbList({ page, pageSize, search, gender, status, sort }) {
  const { column, ascending } = SORTS[sort]
  let q = supabase.from('citizens').select('*', { count: 'exact' })

  const term = search.replace(/[,()%*]/g, ' ').trim()
  if (term) {
    const like = `%${term}%`
    q = q.or(
      `first_name.ilike.${like},last_name.ilike.${like},nin.ilike.${like},temporary_birth_id.ilike.${like}`
    )
  }
  if (gender !== 'all') q = q.eq('gender', gender)
  if (status === 'living') q = q.eq('is_deceased', false)
  if (status === 'deceased') q = q.eq('is_deceased', true)

  const from = (page - 1) * pageSize
  const { data, error, count } = await q
    .order(column, { ascending })
    .order('citizen_id', { ascending: true })
    .range(from, from + pageSize - 1)

  if (error) throw error
  return { rows: data ?? [], total: count ?? 0 }
}

async function sbStats() {
  const count = (build) =>
    build(supabase.from('citizens').select('*', { count: 'exact', head: true })).then(
      ({ count: c, error }) => {
        if (error) throw error
        return c ?? 0
      }
    )

  const [total, deceased, pending, female] = await Promise.all([
    count((q) => q),
    count((q) => q.eq('is_deceased', true)),
    count((q) => q.not('temporary_birth_id', 'is', null)),
    count((q) => q.eq('gender', 'Female')),
  ])
  return { total, deceased, living: total - deceased, pending, female }
}

// ---------- Offline demo mode (no Supabase configured) ----------

let cache
const local = () => (cache ??= generateCitizens(1200))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function localList({ page, pageSize, search, gender, status, sort }) {
  await wait(250)
  const { column, ascending } = SORTS[sort]
  const term = search.trim().toLowerCase()

  let rows = local().filter((r) => {
    if (gender !== 'all' && r.gender !== gender) return false
    if (status === 'living' && r.is_deceased) return false
    if (status === 'deceased' && !r.is_deceased) return false
    if (!term) return true
    return [r.first_name, r.last_name, r.nin, r.temporary_birth_id ?? '']
      .some((v) => v.toLowerCase().includes(term))
  })

  rows = [...rows].sort((a, b) => {
    const cmp = String(a[column]).localeCompare(String(b[column]))
    return (ascending ? cmp : -cmp) || a.citizen_id.localeCompare(b.citizen_id)
  })

  const from = (page - 1) * pageSize
  return { rows: rows.slice(from, from + pageSize), total: rows.length }
}

async function localStats() {
  await wait(150)
  const all = local()
  const deceased = all.filter((r) => r.is_deceased).length
  return {
    total: all.length,
    deceased,
    living: all.length - deceased,
    pending: all.filter((r) => r.temporary_birth_id).length,
    female: all.filter((r) => r.gender === 'Female').length,
  }
}

// ---------- Public API ----------

export const fetchCitizens = (params, demo) => (demo ? localList(params) : sbList(params))
export const fetchStats = (demo) => (demo ? localStats() : sbStats())
