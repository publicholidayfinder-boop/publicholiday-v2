import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cvHolidays = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-13', name: "Democracy Day" },
  { date: '2026-01-20', name: "Heroes' Day" },
  { date: '2026-02-18', name: "Ash Wednesday" },
  { date: '2026-04-05', name: "Easter Sunday" },
  { date: '2026-05-01', name: "Labour Day" },
  { date: '2026-07-05', name: "Independence Day" },
  { date: '2026-08-15', name: "Assumption Day" },
  { date: '2026-11-01', name: "All Saints' Day" },
  { date: '2026-12-25', name: "Christmas Day" }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Remove any existing CV holidays for 2026 just in case
data.holidays = data.holidays.filter(h => !(h.countryCode === 'CV' && h.year === 2026));

for (const h of cvHolidays) {
  const slug = generateSlug(h.name);
  data.holidays.push({
    id: `cv-${slug}-2026`,
    countryCode: 'CV',
    slug: slug,
    name: h.name,
    date: h.date,
    year: 2026,
    type: "National",
    isPublicHoliday: true,
    description: `Celebrated as ${h.name} in Cabo Verde.`,
    observanceRules: "National public holiday."
  });
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Added Cabo Verde holidays for 2026.");
