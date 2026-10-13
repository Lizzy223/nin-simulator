import { ageLabel, avatarTone, formatDate, initials } from '../lib/format'

export function Avatar({ citizen, size = 40 }) {
  const hue = avatarTone(citizen.citizen_id)
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `hsl(${hue} 32% 90%)`,
        color: `hsl(${hue} 45% 26%)`,
      }}
      aria-hidden="true"
    >
      {initials(citizen)}
    </span>
  )
}

export function StatusPill({ deceased }) {
  return (
    <span className={`pill ${deceased ? 'pill--deceased' : 'pill--living'}`}>
      {deceased ? 'Deceased' : 'Living'}
    </span>
  )
}

export default function CitizenList({ rows, loading, onOpen, selectedId }) {
  return (
    <div className={`list ${loading ? 'is-loading' : ''}`} role="list">
      <div className="list__head" aria-hidden="true">
        <span>Citizen</span>
        <span>Date of birth</span>
        <span>CRN</span>
        <span>NIN</span>
        <span>Status</span>
      </div>

      {rows.map((c) => (
        <button
          key={c.citizen_id}
          role="listitem"
          type="button"
          className={`row ${selectedId === c.citizen_id ? 'is-selected' : ''}`}
          onClick={() => onOpen(c)}
        >
          <span className="row__who">
            <Avatar citizen={c} />
            <span>
              <strong>{c.first_name} {c.last_name}</strong>
              <small>{c.gender}</small>
            </span>
          </span>
          <span className="row__dob">
            {formatDate(c.date_of_birth)}
            <small>{ageLabel(c.date_of_birth)}</small>
          </span>
          <span className="row__crn mono">
            {c.crn}
            {c.temporary_birth_id && <small className="tag">{c.temporary_birth_id}</small>}
          </span>
          <span className="row__nin mono">{c.nin_masked}</span>
          <span className="row__status"><StatusPill deceased={c.is_deceased} /></span>
        </button>
      ))}
    </div>
  )
}
