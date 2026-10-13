import { nf } from '../lib/format'

export default function Pagination({ page, pageSize, total, onPage }) {
  const pages = Math.max(Math.ceil(total / pageSize), 1)
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  // compact window: 1 … 4 5 [6] 7 8 … 60
  const nums = new Set([1, pages, page - 1, page, page + 1])
  const list = [...nums].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b)

  return (
    <nav className="pager" aria-label="Pagination">
      <p>
        Showing <strong>{nf.format(from)}–{nf.format(to)}</strong> of <strong>{nf.format(total)}</strong>
      </p>
      <div className="pager__btns">
        <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1}>Previous</button>
        {list.map((n, i) => (
          <span key={n} className="pager__num">
            {i > 0 && n - list[i - 1] > 1 && <em aria-hidden="true">…</em>}
            <button
              type="button"
              className={n === page ? 'is-on' : ''}
              aria-current={n === page ? 'page' : undefined}
              onClick={() => onPage(n)}
            >
              {n}
            </button>
          </span>
        ))}
        <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages}>Next</button>
      </div>
    </nav>
  )
}
