// Deterministic illustrated portrait, derived from the citizen's id and gender.
// Generated locally (no network, no real photos) so the same citizen always looks the same.
const SKIN = ['#8d5a3b', '#6f4428', '#a8714a', '#5b3a24', '#c08a5f', '#4a2f1e']
const HAIR = ['#14110f', '#1d1612', '#2a1c14', '#0d0b0a']
const SHIRT = ['#0b6b45', '#1f5f8b', '#8a5a14', '#6b2d5c', '#2f4858', '#a23b2f']
const BG = ['#e3efe8', '#e8eef5', '#f3ece0', '#efe6ee', '#e6ecec', '#f2e7e4']

function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

export default function Portrait({ citizen }) {
  const h = hash(citizen.citizen_id)
  const pick = (arr, shift) => arr[(h >>> shift) % arr.length]
  const skin = pick(SKIN, 0)
  const shirt = pick(SHIRT, 6)
  const bg = pick(BG, 9)
  const female = citizen.gender === 'Female'
  const style = (h >>> 12) % 3
  const age = new Date().getFullYear() - Number(citizen.date_of_birth.slice(0, 4))
  const hair = age > 62 ? '#c4c4c4' : pick(HAIR, 3)

  return (
    <svg
      className="portrait"
      viewBox="0 0 120 150"
      role="img"
      aria-label={`Photo of ${citizen.first_name} ${citizen.last_name}`}
    >
      <rect width="120" height="150" fill={bg} />
      {female && style !== 2 && <path d="M28 60c0-30 14-42 32-42s32 12 32 42v50H28z" fill={hair} />}
      <path d="M14 150c0-26 20-40 46-40s46 14 46 40z" fill={shirt} />
      <rect x="51" y="86" width="18" height="26" rx="8" fill={skin} />
      <ellipse cx="60" cy="62" rx="25" ry="30" fill={skin} />
      {female ? (
        <path
          d={style === 2
            ? 'M33 58c-2-24 12-34 27-34s29 10 27 34c-8-12-18-17-27-17s-19 5-27 17z'
            : 'M35 60c0-20 10-30 25-30s25 10 25 30c-10-8-17-12-25-12s-15 4-25 12z'}
          fill={hair}
        />
      ) : (
        <path
          d={style === 1
            ? 'M35 54c0-22 11-30 25-30s25 8 25 30c-6-10-14-14-25-14s-19 4-25 14z'
            : 'M36 50c2-18 12-24 24-24s22 6 24 24c-8-7-15-9-24-9s-16 2-24 9z'}
          fill={hair}
        />
      )}
      {!female && style === 0 && age > 28 && (
        <path d="M38 70c4 18 14 24 22 24s18-6 22-24c-4 10-12 14-22 14s-18-4-22-14z" fill={hair} opacity=".9" />
      )}
      <circle cx="50" cy="63" r="2.6" fill="#1a1411" />
      <circle cx="70" cy="63" r="2.6" fill="#1a1411" />
      <path d="M52 76q8 6 16 0" stroke="#1a1411" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}
