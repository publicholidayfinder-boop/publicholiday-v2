import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Guinea-Bissau 2026 public holidays
const gwHolidays = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-20', name: "Heroes' Day" },
  { date: '2026-03-08', name: "International Women's Day" },
  { date: '2026-03-20', name: "Eid al-Fitr" },
  { date: '2026-05-01', name: "Labour Day" },
  { date: '2026-05-27', name: "Eid al-Adha" },
  { date: '2026-06-17', name: "Islamic New Year" },
  { date: '2026-08-03', name: "Colonialism Overthrow Day" },
  { date: '2026-08-26', name: "Prophet's Birthday (Mawlid)" },
  { date: '2026-09-12', name: "National Day / Re-Adjustment Movement Day" },
  { date: '2026-11-14', name: "Independence Day Proclamation" },
  { date: '2026-12-25', name: "Christmas Day" }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Remove any existing GW holidays for 2026 just in case
data.holidays = data.holidays.filter(h => !(h.countryCode === 'GW' && h.year === 2026));

for (const h of gwHolidays) {
  const slug = generateSlug(h.name);
  data.holidays.push({
    id: `gw-${slug}-2026`,
    countryCode: 'GW',
    slug: slug,
    name: h.name,
    date: h.date,
    year: 2026,
    type: "National",
    isPublicHoliday: true,
    description: `Celebrated as ${h.name} in Guinea-Bissau.`,
    observanceRules: "National public holiday."
  });
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Added Guinea-Bissau holidays for 2026.");
