import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Filters from './components/Filters'
import CitizenList from './components/CitizenList'
import Pagination from './components/Pagination'
import CitizenDrawer from './components/CitizenDrawer'
import { fetchCitizens } from './lib/api'
import { isSupabaseConfigured } from './lib/supabase'

const PAGE_SIZE = 24

export default function App() {
  const [demo, setDemo] = useState(!isSupabaseConfigured)
  // `searchInput` is what's typed; `search` is the term that was actually submitted.
  const [query, setQuery] = useState({
    searchInput: '', search: '', gender: 'all', status: 'all', sort: 'name_asc', page: 1,
  })
  const [data, setData] = useState({ rows: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  // Nothing is fetched until a search has been submitted.
  useEffect(() => {
    if (!query.search) {
      setData({ rows: [], total: 0 })
      setLoading(false)
      return
    }
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

  const runSearch = () =>
    setQuery((q) => ({ ...q, search: q.searchInput.trim(), page: 1 }))

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
          <h1>Find a citizen</h1>
          <p>Search by name, NIN or temporary birth ID to bring up matching photos.</p>
          <Filters query={query} onChange={update} onSearch={runSearch} />
        </section>

        {demo && !isSupabaseConfigured && (
          <p className="notice">
            Supabase isn’t configured, so searches run on generated records in your browser.
            Add your keys to <code>.env</code> to search your database.
          </p>
        )}

        {error ? (
          <div className="state state--error" role="alert">
            <h2>Couldn’t load records</h2>
            <p>{error}</p>
            <p>Check that you ran <code>npm run db:upload</code> and that the read policy exists.</p>
            <button type="button" className="primary" onClick={() => setDemo(true)}>Use demo data instead</button>
          </div>
        ) : !query.search ? (
          <div className="state">
            <h2>Search to see citizens</h2>
            <p>No records are shown until you search. Enter a name, NIN or temporary birth ID and press Search.</p>
          </div>
        ) : data.rows.length === 0 && !loading ? (
          <div className="state">
            <h2>No matching citizens</h2>
            <p>Try a shorter name, or clear the status and gender filters.</p>
            <button
              type="button"
              className="primary"
              onClick={() => update({ gender: 'all', status: 'all' })}
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
