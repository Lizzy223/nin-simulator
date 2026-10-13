import { useEffect, useState } from 'react'
import { ageLabel, formatDate, initials } from '../lib/format'
import { StatusPill } from './CitizenList'

function CopyField({ label, value }) {
  const [done, setDone] = useState(false)
  if (!value) {
    return (
      <div className="field">
        <dt>{label}</dt>
        <dd className="muted">Not issued</dd>
      </div>
    )
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      setTimeout(() => setDone(false), 1400)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="field">
      <dt>{label}</dt>
      <dd>
        <span className="mono">{value}</span>
        <button type="button" className="copy" onClick={copy}>
          {done ? 'Copied' : 'Copy'}
        </button>
      </dd>
    </div>
  )
}

export default function CitizenDrawer({ citizen, onClose }) {
  const [json, setJson] = useState(false)

  useEffect(() => {
    if (!citizen) return
    setJson(false)
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [citizen, onClose])

  if (!citizen) return null
  const c = citizen

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={`${c.first_name} ${c.last_name}`}>
        <button type="button" className="drawer__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        <div className={`idcard ${c.is_deceased ? 'idcard--deceased' : ''}`}>
          <div className="idcard__pattern" aria-hidden="true" />
          <div className="idcard__top">
            <span>Simulated identity record</span>
            <span className="idcard__mock">Mock data</span>
          </div>
          <div className="idcard__body">
            <div className="idcard__photo" aria-hidden="true">{initials(c)}</div>
            <div>
              <p className="idcard__label">Surname</p>
              <p className="idcard__value idcard__value--big">{c.last_name}</p>
              <p className="idcard__label">Given name</p>
              <p className="idcard__value">{c.first_name}</p>
            </div>
          </div>
          <div className="idcard__grid">
            <div><p className="idcard__label">Date of birth</p><p className="idcard__value">{formatDate(c.date_of_birth)}</p></div>
            <div><p className="idcard__label">Sex</p><p className="idcard__value">{c.gender}</p></div>
            <div><p className="idcard__label">NIN</p><p className="idcard__value mono">{c.nin_masked}</p></div>
          </div>
          {c.is_deceased && <div className="idcard__stamp">Deceased</div>}
        </div>

        <div className="drawer__status">
          <StatusPill deceased={c.is_deceased} />
          <span>{ageLabel(c.date_of_birth)} old{c.is_deceased ? ' at last record' : ''}</span>
        </div>

        <dl className="fields">
          <CopyField label="Citizen ID" value={c.citizen_id} />
          <CopyField label="Civil registration number (CRN)" value={c.crn} />
          <CopyField label="Temporary birth ID" value={c.temporary_birth_id} />
          <CopyField label="NIN (masked)" value={c.nin_masked} />
        </dl>

        <button type="button" className="ghost" onClick={() => setJson((v) => !v)} aria-expanded={json}>
          {json ? 'Hide' : 'View'} API response
        </button>
        {json && <pre className="json">{JSON.stringify(c, null, 2)}</pre>}
      </aside>
    </div>
  )
}
