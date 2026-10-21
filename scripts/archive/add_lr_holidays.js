import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liberia 2026 public holidays
const lrHolidays = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-02-11', name: "Armed Forces Day" },
  { date: '2026-03-15', name: "J.J. Roberts' Birthday" },
  { date: '2026-04-03', name: "Good Friday" },
  { date: '2026-04-06', name: "Easter Monday" },
  { date: '2026-05-01', name: "Fast and Prayer Day" },
  { date: '2026-05-14', name: "National Unification Day" },
  { date: '2026-07-26', name: "Independence Day" },
  { date: '2026-08-24', name: "Flag Day" },
  { date: '2026-11-01', name: "All Saints' Day" },
  { date: '2026-11-07', name: "Election Day" },
  { date: '2026-11-29', name: "President W.V.S. Tubman's Birthday" },
  { date: '2026-12-25', name: "Christmas Day" }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Remove any existing LR holidays for 2026 just in case
data.holidays = data.holidays.filter(h => !(h.countryCode === 'LR' && h.year === 2026));

for (const h of lrHolidays) {
  const slug = generateSlug(h.name);
  data.holidays.push({
    id: `lr-${slug}-2026`,
    countryCode: 'LR',
    slug: slug,
    name: h.name,
    date: h.date,
    year: 2026,
    type: "National",
    isPublicHoliday: true,
    description: `Celebrated as ${h.name} in Liberia.`,
    observanceRules: "National public holiday."
  });
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Added Liberia holidays for 2026.");
