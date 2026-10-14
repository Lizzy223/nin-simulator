import Portrait from './Portrait'

export function StatusPill({ deceased }) {
  return (
    <span className={`pill ${deceased ? 'pill--deceased' : 'pill--living'}`}>
      {deceased ? 'Deceased' : 'Living'}
    </span>
  )
}

// Photos only. Every detail lives in the drawer that opens on click.
export default function CitizenList({ rows, loading, onOpen, selectedId }) {
  return (
    <div className={`gallery ${loading ? 'is-loading' : ''}`} role="list">
      {rows.map((c) => (
        <button
          key={c.citizen_id}
          role="listitem"
          type="button"
          className={`photo ${selectedId === c.citizen_id ? 'is-selected' : ''} ${c.is_deceased ? 'photo--deceased' : ''}`}
          onClick={() => onOpen(c)}
          aria-label={`Open record for ${c.first_name} ${c.last_name}`}
        >
          <Portrait citizen={c} />
        </button>
      ))}
    </div>
  )
}
