import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All EU countries + DE and FR which were already in the app
const euCountries = [
  { id: 'AT', name: 'Austria' },
  { id: 'BE', name: 'Belgium' },
  { id: 'BG', name: 'Bulgaria' },
  { id: 'HR', name: 'Croatia' },
  { id: 'CY', name: 'Cyprus' },
  { id: 'CZ', name: 'Czechia' },
  { id: 'DK', name: 'Denmark' },
  { id: 'EE', name: 'Estonia' },
  { id: 'FI', name: 'Finland' },
  { id: 'FR', name: 'France' },
  { id: 'DE', name: 'Germany' },
  { id: 'GR', name: 'Greece' },
  { id: 'HU', name: 'Hungary' },
  { id: 'IE', name: 'Ireland' },
  { id: 'IT', name: 'Italy' },
  { id: 'LV', name: 'Latvia' },
  { id: 'LT', name: 'Lithuania' },
  { id: 'LU', name: 'Luxembourg' },
  { id: 'MT', name: 'Malta' },
  { id: 'NL', name: 'Netherlands' },
  { id: 'PL', name: 'Poland' },
  { id: 'PT', name: 'Portugal' },
  { id: 'RO', name: 'Romania' },
  { id: 'SK', name: 'Slovakia' },
  { id: 'SI', name: 'Slovenia' },
  { id: 'ES', name: 'Spain' },
  { id: 'SE', name: 'Sweden' }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

async function fetchHolidays(year, countryCode) {
  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    if (res.status === 204) {
      console.warn(`  No content (204) for ${countryCode} in ${year}`);
      return [];
    }
    if (!res.ok) {
      console.warn(`  Failed to fetch for ${countryCode} in ${year}: ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (e) {
    console.error(`  Error fetching ${countryCode}:`, e.message);
    return [];
  }
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function run() {
  const year = 2027;

  for (const country of euCountries) {
    // Remove any existing 2027 entries for this country
    data.holidays = data.holidays.filter(h => !(h.countryCode === country.id && h.year === year));

    const apiHolidays = await fetchHolidays(year, country.id);
    let added = 0;

    for (const h of apiHolidays) {
      if (!h.types || !h.types.includes("Public")) continue;
      const slug = generateSlug(h.name);
      data.holidays.push({
        id: `${country.id.toLowerCase()}-${slug}-${year}`,
        countryCode: country.id,
        slug: slug,
        name: h.name,
        date: h.date,
        year: year,
        type: "National",
        isPublicHoliday: true,
        description: `Celebrated as ${h.localName} in ${country.name}.`,
        observanceRules: "National public holiday."
      });
      added++;
    }

    console.log(`Added ${added} holidays for ${country.name} (${country.id}) in ${year}`);

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("\nDone. All 2027 holidays added for EU countries.");
}

run();
