import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sierra Leone 2026 public holidays
const slHolidays = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-03-20', name: "Eid al-Fitr" },
  { date: '2026-04-03', name: "Good Friday" },
  { date: '2026-04-06', name: "Easter Monday" },
  { date: '2026-04-27', name: "Independence Day" },
  { date: '2026-05-01', name: "Labour Day" },
  { date: '2026-05-27', name: "Eid al-Adha" },
  { date: '2026-08-26', name: "Prophet's Birthday (Mawlid)" },
  { date: '2026-12-25', name: "Christmas Day" },
  { date: '2026-12-26', name: "Boxing Day" }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Remove any existing SL holidays for 2026 just in case
data.holidays = data.holidays.filter(h => !(h.countryCode === 'SL' && h.year === 2026));

for (const h of slHolidays) {
  const slug = generateSlug(h.name);
  data.holidays.push({
    id: `sl-${slug}-2026`,
    countryCode: 'SL',
    slug: slug,
    name: h.name,
    date: h.date,
    year: 2026,
    type: "National",
    isPublicHoliday: true,
    description: `Celebrated as ${h.name} in Sierra Leone.`,
    observanceRules: "National public holiday."
  });
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Added Sierra Leone holidays for 2026.");
