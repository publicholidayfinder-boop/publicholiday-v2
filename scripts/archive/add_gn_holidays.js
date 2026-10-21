import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Guinea 2026 public holidays
const gnHolidays = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-03-20', name: "Eid al-Fitr" },
  { date: '2026-04-03', name: "Good Friday" },
  { date: '2026-04-06', name: "Easter Monday" },
  { date: '2026-05-01', name: "Labour Day" },
  { date: '2026-05-25', name: "Africa Day" },
  { date: '2026-05-27', name: "Eid al-Adha" },
  { date: '2026-06-17', name: "Islamic New Year" },
  { date: '2026-08-26', name: "Prophet's Birthday (Mawlid)" },
  { date: '2026-10-02', name: "Independence Day" },
  { date: '2026-11-01', name: "All Saints' Day" },
  { date: '2026-12-25', name: "Christmas Day" }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Remove any existing GN holidays for 2026 just in case
data.holidays = data.holidays.filter(h => !(h.countryCode === 'GN' && h.year === 2026));

for (const h of gnHolidays) {
  const slug = generateSlug(h.name);
  data.holidays.push({
    id: `gn-${slug}-2026`,
    countryCode: 'GN',
    slug: slug,
    name: h.name,
    date: h.date,
    year: 2026,
    type: "National",
    isPublicHoliday: true,
    description: `Celebrated as ${h.name} in Guinea.`,
    observanceRules: "National public holiday."
  });
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Added Guinea holidays for 2026.");
