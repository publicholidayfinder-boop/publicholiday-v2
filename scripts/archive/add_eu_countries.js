import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const euCountries = [
  { id: 'AT', name: 'Austria', emoji: '🇦🇹' },
  { id: 'BE', name: 'Belgium', emoji: '🇧🇪' },
  { id: 'BG', name: 'Bulgaria', emoji: '🇧🇬' },
  { id: 'HR', name: 'Croatia', emoji: '🇭🇷' },
  { id: 'CY', name: 'Cyprus', emoji: '🇨🇾' },
  { id: 'CZ', name: 'Czechia', emoji: '🇨🇿' },
  { id: 'DK', name: 'Denmark', emoji: '🇩🇰' },
  { id: 'EE', name: 'Estonia', emoji: '🇪🇪' },
  { id: 'FI', name: 'Finland', emoji: '🇫🇮' },
  { id: 'GR', name: 'Greece', emoji: '🇬🇷' },
  { id: 'HU', name: 'Hungary', emoji: '🇭🇺' },
  { id: 'IE', name: 'Ireland', emoji: '🇮🇪' },
  { id: 'IT', name: 'Italy', emoji: '🇮🇹' },
  { id: 'LV', name: 'Latvia', emoji: '🇱🇻' },
  { id: 'LT', name: 'Lithuania', emoji: '🇱🇹' },
  { id: 'LU', name: 'Luxembourg', emoji: '🇱🇺' },
  { id: 'MT', name: 'Malta', emoji: '🇲🇹' },
  { id: 'NL', name: 'Netherlands', emoji: '🇳🇱' },
  { id: 'PL', name: 'Poland', emoji: '🇵🇱' },
  { id: 'PT', name: 'Portugal', emoji: '🇵🇹' },
  { id: 'RO', name: 'Romania', emoji: '🇷🇴' },
  { id: 'SK', name: 'Slovakia', emoji: '🇸🇰' },
  { id: 'SI', name: 'Slovenia', emoji: '🇸🇮' },
  { id: 'ES', name: 'Spain', emoji: '🇪🇸' },
  { id: 'SE', name: 'Sweden', emoji: '🇸🇪' }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

async function fetchHolidays(year, countryCode) {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
  if (!res.ok) {
    console.warn(`Failed to fetch for ${countryCode} in ${year}`);
    return [];
  }
  return await res.json();
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function run() {
  for (const country of euCountries) {
    // Check if country already exists
    if (data.countries.find(c => c.id === country.id)) {
      console.log(`Skipping ${country.id}, already exists.`);
      continue;
    }

    // Add country metadata
    data.countries.push({
      id: country.id,
      name: country.name,
      description: {
        en: `${country.name} observes a mix of national and regional public holidays that reflect its history, culture, and traditions. These holidays influence work schedules, school terms, travel plans, and the availability of public services.`
      },
      sections: [
        {
          title: `How Public Holidays Are Observed in ${country.name}`,
          content: `On most public holidays in ${country.name}, government offices, schools, and banks are closed. Many private businesses also close or operate on reduced hours.`
        },
        {
          title: "Frequently Asked Questions",
          items: [
            {
              q: `Are all public holidays observed nationwide in ${country.name}?`,
              a: "While many holidays are national, some may be observed only in specific regions or states."
            },
            {
              q: "Do businesses close on public holidays?",
              a: "Generally yes, though essential services and some retail sectors may remain open."
            }
          ]
        }
      ]
    });

    // Fetch and add holidays
    const apiHolidays = await fetchHolidays(2026, country.id);
    for (const h of apiHolidays) {
      if (!h.types.includes("Public")) continue;

      const slug = generateSlug(h.name);
      data.holidays.push({
        id: `${country.id.toLowerCase()}-${slug}-2026`,
        countryCode: country.id,
        slug: slug,
        name: h.name,
        date: h.date,
        year: 2026,
        type: "National",
        isPublicHoliday: true,
        description: `Celebrated as ${h.localName} in ${country.name}.`,
        observanceRules: "National public holiday."
      });
    }

    console.log(`Added ${country.name}`);
    
    // Add small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("Done.");
}

run();
