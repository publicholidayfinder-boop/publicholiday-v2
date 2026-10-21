import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mrHolidays = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-03-20', name: "Eid al-Fitr" },
  { date: '2026-05-01', name: "Labour Day" },
  { date: '2026-05-25', name: "Africa Day" },
  { date: '2026-05-27', name: "Eid al-Adha" },
  { date: '2026-06-17', name: "Islamic New Year" },
  { date: '2026-08-26', name: "Prophet's Birthday (Mawlid)" },
  { date: '2026-11-28', name: "Independence Day" }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Remove any existing MR holidays for 2026 just in case
data.holidays = data.holidays.filter(h => !(h.countryCode === 'MR' && h.year === 2026));

for (const h of mrHolidays) {
  const slug = generateSlug(h.name);
  data.holidays.push({
    id: `mr-${slug}-2026`,
    countryCode: 'MR',
    slug: slug,
    name: h.name,
    date: h.date,
    year: 2026,
    type: "National",
    isPublicHoliday: true,
    description: `Celebrated as ${h.name} in Mauritania.`,
    observanceRules: "National public holiday."
  });
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Added Mauritania holidays for 2026.");
