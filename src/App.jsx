import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Stats from './components/Stats'
import Filters from './components/Filters'
import CitizenList from './components/CitizenList'
import Pagination from './components/Pagination'
import CitizenDrawer from './components/CitizenDrawer'
import { fetchCitizens, fetchStats } from './lib/api'
import { isSupabaseConfigured } from './lib/supabase'

const PAGE_SIZE = 20

export default function App() {
  const [demo, setDemo] = useState(!isSupabaseConfigured)
  const [query, setQuery] = useState({
    searchInput: '', search: '', gender: 'all', status: 'all', sort: 'name_asc', page: 1,
  })
  const [data, setData] = useState({ rows: [], total: 0 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery((q) => (q.search === q.searchInput.trim() ? q : { ...q, search: q.searchInput.trim(), page: 1 }))
    }, 300)
    return () => clearTimeout(t)
  }, [query.searchInput])

  // Stats
  useEffect(() => {
    let live = true
    setStats(null)
    fetchStats(demo).then((s) => live && setStats(s)).catch(() => live && setStats(null))
    return () => { live = false }
  }, [demo])

  // List
  useEffect(() => {
    let live = true
    setLoading(true)
    setError(null)
    const { search, gender, status, sort, page } = query
    fetchCitizens({ search, gender, status, sort, page, pageSize: PAGE_SIZE }, demo)
      .then((res) => live && setData(res))
      .catch((e) => live && setError(e.message || 'Could not load records.'))
      .finally(() => live && setLoading(false))
    return () => { live = false }
  }, [query.search, query.gender, query.status, query.sort, query.page, demo])

  const update = (patch) =>
    setQuery((q) => ({ ...q, ...patch, page: 'page' in patch ? patch.page : 1 }))

  const goPage = (page) => {
    update({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const close = useCallback(() => setSelected(null), [])

  return (
    <>
      <Header demo={demo} />

      <main className="page">
        <section className="hero">
          <h1>Find a citizen record</h1>
          <p>Search the registry by name, civil registration number or temporary birth ID.</p>
          <Filters query={query} onChange={update} />
        </section>

        <Stats stats={stats} />

        {demo && !isSupabaseConfigured && (
          <p className="notice">
            Supabase isn’t configured, so you’re browsing 1,200 generated records in your browser.
            Add your keys to <code>.env</code> to load them from your database.
          </p>
        )}

        {error ? (
          <div className="state state--error" role="alert">
            <h2>Couldn’t load records</h2>
            <p>{error}</p>
            <p>Check that you ran <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code>, and that the read policy exists.</p>
            <button type="button" className="primary" onClick={() => setDemo(true)}>Use demo data instead</button>
          </div>
        ) : data.rows.length === 0 && !loading ? (
          <div className="state">
            <h2>No matching records</h2>
            <p>Try a shorter name, or clear the status and gender filters.</p>
            <button
              type="button"
              className="primary"
              onClick={() => update({ searchInput: '', search: '', gender: 'all', status: 'all' })}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <CitizenList rows={data.rows} loading={loading} onOpen={setSelected} selectedId={selected?.citizen_id} />
            <Pagination page={query.page} pageSize={PAGE_SIZE} total={data.total} onPage={goPage} />
          </>
        )}

        <footer className="foot">
          This is a simulation built on mock data. No real person is represented.
        </footer>
      </main>

      <CitizenDrawer citizen={selected} onClose={close} />
    </>
  )
}
