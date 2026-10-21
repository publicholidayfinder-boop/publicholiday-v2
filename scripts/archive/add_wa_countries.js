import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const waCountries = [
  { id: 'BJ', name: 'Benin', emoji: '🇧🇯' },
  { id: 'BF', name: 'Burkina Faso', emoji: '🇧🇫' },
  { id: 'CV', name: 'Cabo Verde', emoji: '🇨🇻' },
  { id: 'CI', name: "Côte d'Ivoire", emoji: '🇨🇮' },
  { id: 'GM', name: 'Gambia', emoji: '🇬🇲' },
  { id: 'GN', name: 'Guinea', emoji: '🇬🇳' },
  { id: 'GW', name: 'Guinea-Bissau', emoji: '🇬🇼' },
  { id: 'LR', name: 'Liberia', emoji: '🇱🇷' },
  { id: 'ML', name: 'Mali', emoji: '🇲🇱' },
  { id: 'MR', name: 'Mauritania', emoji: '🇲🇷' },
  { id: 'NE', name: 'Niger', emoji: '🇳🇪' },
  { id: 'SN', name: 'Senegal', emoji: '🇸🇳' },
  { id: 'SL', name: 'Sierra Leone', emoji: '🇸🇱' }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

async function fetchHolidays(year, countryCode) {
  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    if (res.status === 204) {
      console.warn(`No content (204) for ${countryCode} in ${year}`);
      return [];
    }
    if (!res.ok) {
      console.warn(`Failed to fetch for ${countryCode} in ${year}`);
      return [];
    }
    return await res.json();
  } catch (e) {
    console.error(`Error fetching ${countryCode}:`, e);
    return [];
  }
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function run() {
  for (const country of waCountries) {
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
        en: `${country.name} observes a mix of national and religious public holidays that reflect its history, culture, and diverse traditions. These holidays influence work schedules, school terms, travel plans, and the availability of public services.`
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
              a: "Yes, most public holidays are observed nationally."
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
      if (!h.types || (!h.types.includes("Public") && !h.types.includes("National"))) continue;

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
