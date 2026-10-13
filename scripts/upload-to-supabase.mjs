// Usage: npm run db:upload
// Creates the citizens table in your Supabase Postgres database and uploads supabase/seed.sql.
// Requires DATABASE_URL in .env (Supabase -> Connect -> Connection string -> URI).
import { readFileSync } from 'node:fs'
import 'dotenv/config'
import pg from 'pg'

const url = process.env.DATABASE_URL
if (!url || url.includes('YOUR-')) {
  console.error('Missing DATABASE_URL in .env (see .env.example).')
  process.exit(1)
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await client.connect()

try {
  await client.query(readFileSync('supabase/schema.sql', 'utf8'))
  console.log('Schema ready.')

  await client.query('begin')
  await client.query(readFileSync('supabase/seed.sql', 'utf8'))
  await client.query('commit')

  const { rows } = await client.query('select count(*)::int as n from public.citizens')
  console.log(`Done. public.citizens now has ${rows[0].n} rows.`)
} catch (e) {
  await client.query('rollback').catch(() => {})
  console.error('Upload failed:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
