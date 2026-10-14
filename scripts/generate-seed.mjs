// Usage: npm run seed:generate [count]
// Writes supabase/seed.sql and supabase/seed.csv with mock citizens (default 1,200).
import { writeFileSync } from 'node:fs'
import { generateCitizens } from '../src/lib/generator.js'

const COUNT = Number(process.argv[2] || 1200)
const rows = generateCitizens(COUNT)

const q = (v) => (v === null ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const cols = [
  'citizen_id','first_name','last_name','date_of_birth','gender',
  'nin','temporary_birth_id','is_deceased',
]

const chunks = []
for (let i = 0; i < rows.length; i += 200) {
  const values = rows
    .slice(i, i + 200)
    .map((r) =>
      `(${[q(r.citizen_id), q(r.first_name), q(r.last_name), q(r.date_of_birth), q(r.gender), q(r.nin), q(r.temporary_birth_id), r.is_deceased].join(', ')})`
    )
    .join(',\n  ')
  chunks.push(`insert into public.citizens (${cols.join(', ')}) values\n  ${values}\non conflict (citizen_id) do nothing;`)
}

writeFileSync('supabase/seed.sql', `-- ${rows.length} mock citizens (generated)\n\n${chunks.join('\n\n')}\n`)

const csv = [cols.join(',')]
  .concat(rows.map((r) => cols.map((c) => (r[c] === null ? '' : r[c])).join(',')))
  .join('\n')
writeFileSync('supabase/seed.csv', csv + '\n')

console.log(`Wrote ${rows.length} rows to supabase/seed.sql and supabase/seed.csv`)
