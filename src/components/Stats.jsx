import { nf } from '../lib/format'

export default function Stats({ stats }) {
  const items = [
    { label: 'Records', value: stats?.total },
    { label: 'Living', value: stats?.living },
    { label: 'Deceased', value: stats?.deceased },
    { label: 'Temporary birth IDs', value: stats?.pending },
  ]
  return (
    <dl className="stats">
      {items.map((s) => (
        <div key={s.label} className="stats__item">
          <dd>{s.value == null ? <span className="skeleton" /> : nf.format(s.value)}</dd>
          <dt>{s.label}</dt>
        </div>
      ))}
    </dl>
  )
}
