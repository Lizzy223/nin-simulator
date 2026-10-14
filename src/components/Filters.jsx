import { SORTS } from '../lib/api'

export default function Filters({ query, onChange, onSearch }) {
  return (
    <form
      className="filters"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      <label className="search">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="sr">Search citizens</span>
        <input
          type="search"
          value={query.searchInput}
          onChange={(e) => onChange({ searchInput: e.target.value })}
          placeholder="Search by name, NIN or temporary birth ID"
          autoFocus
        />
        <button type="submit" className="search__go">Search</button>
      </label>

      <div className="filters__row">
        <div className="seg" role="group" aria-label="Status">
          {[['all', 'All'], ['living', 'Living'], ['deceased', 'Deceased']].map(([v, l]) => (
            <button
              key={v}
              type="button"
              className={query.status === v ? 'is-on' : ''}
              aria-pressed={query.status === v}
              onClick={() => onChange({ status: v })}
            >
              {l}
            </button>
          ))}
        </div>

        <label className="select">
          <span>Gender</span>
          <select value={query.gender} onChange={(e) => onChange({ gender: e.target.value })}>
            <option value="all">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>

        <label className="select">
          <span>Sort</span>
          <select value={query.sort} onChange={(e) => onChange({ sort: e.target.value })}>
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>
    </form>
  )
}
