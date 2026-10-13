export default function Header({ demo }) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="brand">
          <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="#0b6b45" />
            <path d="M32 12c-8 6-14 13-14 21 0 8 6 14 14 19 8-5 14-11 14-19 0-8-6-15-14-21z" fill="none" stroke="#f4c542" strokeWidth="3" />
            <circle cx="32" cy="32" r="5" fill="#fff" />
          </svg>
          <div>
            <strong>NIN Registry</strong>
            <span>Simulated citizen lookup</span>
          </div>
        </div>
        <span className={`source ${demo ? 'source--demo' : 'source--live'}`}>
          <i aria-hidden="true" />
          {demo ? 'Demo data (offline)' : 'Connected to Supabase'}
        </span>
      </div>
    </header>
  )
}
