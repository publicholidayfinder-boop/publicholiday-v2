import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ciHolidays = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-03-20', name: "Eid al-Fitr (End of Ramadan)" },
  { date: '2026-04-06', name: "Easter Monday" },
  { date: '2026-05-01', name: "Labour Day" },
  { date: '2026-05-14', name: "Ascension Day" },
  { date: '2026-05-25', name: "Whit Monday" },
  { date: '2026-05-27', name: "Eid al-Adha (Tabaski)" },
  { date: '2026-08-07', name: "Independence Day" },
  { date: '2026-08-15', name: "Assumption Day" },
  { date: '2026-08-26', name: "The Prophet's Birthday (Mawlid)" },
  { date: '2026-11-01', name: "All Saints' Day" },
  { date: '2026-11-15', name: "National Peace Day" },
  { date: '2026-12-25', name: "Christmas Day" }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Remove any existing CI holidays for 2026 just in case
data.holidays = data.holidays.filter(h => !(h.countryCode === 'CI' && h.year === 2026));

for (const h of ciHolidays) {
  const slug = generateSlug(h.name);
  data.holidays.push({
    id: `ci-${slug}-2026`,
    countryCode: 'CI',
    slug: slug,
    name: h.name,
    date: h.date,
    year: 2026,
    type: "National",
    isPublicHoliday: true,
    description: `Celebrated as ${h.name} in Côte d'Ivoire.`,
    observanceRules: "National public holiday."
  });
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Added Côte d'Ivoire holidays for 2026.");
