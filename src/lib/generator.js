// Deterministic mock-data generator.
// Used by (1) scripts/generate-seed.mjs to build the Supabase seed
// and (2) the app's offline demo mode when Supabase isn't configured.

const FIRST_MALE = [
  'Chinedu','Emeka','Ifeanyi','Obinna','Tunde','Segun','Femi','Kayode','Ibrahim','Musa',
  'Abubakar','Yusuf','Sani','Aminu','Bello','Uche','Nnamdi','Chukwuemeka','Olumide','Adebayo',
  'Babatunde','Oluwaseun','Damilare','Ayodele','Tobi','Ebuka','Kelechi','Ikenna','Godwin','Efe',
  'Osagie','Tamunoemi','Ebiye','Ismail','Garba','Danjuma','Samuel','Emmanuel','Daniel','Ahmed',
]
const FIRST_FEMALE = [
  'Amaka','Chioma','Ngozi','Ifeoma','Adaeze','Blessing','Funke','Folake','Yetunde','Bukola',
  'Aisha','Fatima','Zainab','Halima','Hadiza','Maryam','Khadija','Amina','Nkechi','Oluchi',
  'Titilayo','Omolara','Temitope','Damilola','Ronke','Sade','Bisi','Ebere','Uchechi','Chiamaka',
  'Efua','Ibinabo','Tarila','Joy','Grace','Mercy','Esther','Ruth','Hauwa','Safiya',
]
const LAST = [
  'Okafor','Adeyemi','Balogun','Ibrahim','Eze','Nwosu','Okonkwo','Abubakar','Bello','Danjuma',
  'Ogunleye','Adebayo','Olawale','Afolabi','Oyelaran','Chukwu','Nnamdi','Okoro','Obi','Umeh',
  'Lawal','Yusuf','Suleiman','Garba','Musa','Usman','Aliyu','Mohammed','Sanni','Bakare',
  'Fashola','Akinwale','Ogundipe','Oladipo','Ajayi','Onyeama','Nwachukwu','Ezekwesili','Igwe','Ugwu',
  'Peterside','Briggs','Amadi','Ekpo','Effiong','Udoh','Inyang','Etim','Bassey','Okon',
  'Kalu','Agu','Anyanwu','Mbah','Ojo','Alabi','Ogunbiyi','Salami','Tijani','Waziri',
]

// Small fast seeded PRNG so every run produces the same data.
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)]
const digits = (rng, n) => Array.from({ length: n }, () => Math.floor(rng() * 10)).join('')
const hex = (rng, n) => Array.from({ length: n }, () => Math.floor(rng() * 16).toString(16)).join('')
const pad = (n) => String(n).padStart(2, '0')

function uuid(rng) {
  return `${hex(rng, 8)}-${hex(rng, 4)}-4${hex(rng, 3)}-${'89ab'[Math.floor(rng() * 4)]}${hex(rng, 3)}-${hex(rng, 12)}`
}

function randomDob(rng) {
  const r = rng()
  let year
  if (r < 0.08) year = 1938 + Math.floor(rng() * 22)       // elders
  else if (r < 0.62) year = 1960 + Math.floor(rng() * 40)  // adults
  else if (r < 0.9) year = 2000 + Math.floor(rng() * 18)   // young adults
  else year = 2018 + Math.floor(rng() * 8)                 // children / infants
  const month = 1 + Math.floor(rng() * 12)
  const day = 1 + Math.floor(rng() * 28)
  return `${year}-${pad(month)}-${pad(day)}`
}

export function generateCitizens(count = 1200, seed = 20261012) {
  const rng = mulberry32(seed)
  const seenNin = new Set()
  const rows = []

  for (let i = 0; i < count; i++) {
    const gender = rng() < 0.5 ? 'Male' : 'Female'
    const first_name = pick(rng, gender === 'Male' ? FIRST_MALE : FIRST_FEMALE)
    const last_name = pick(rng, LAST)
    const date_of_birth = randomDob(rng)
    const birthYear = Number(date_of_birth.slice(0, 4))

    // NIN is a unique 11-digit number.
    let nin
    do {
      nin = digits(rng, 11)
    } while (seenNin.has(nin))
    seenNin.add(nin)

    // Only recent births still carry a temporary birth ID, and only some of them.
    const hasTemp = birthYear >= 2018 && rng() < 0.7
    const temporary_birth_id = hasTemp ? `TBID-${hex(rng, 6).toUpperCase()}` : null

    const age = 2026 - birthYear
    const is_deceased = age > 35 && rng() < (age > 75 ? 0.28 : 0.06)

    rows.push({
      citizen_id: uuid(rng),
      first_name,
      last_name,
      date_of_birth,
      gender,
      temporary_birth_id,
      nin,
      is_deceased,
    })
  }
  return rows
}
