import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const snHolidays = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-03-20', name: "Korité (Eid al-Fitr)" },
  { date: '2026-04-04', name: "Independence Day" },
  { date: '2026-04-06', name: "Easter Monday" },
  { date: '2026-05-01', name: "Labour Day" },
  { date: '2026-05-14', name: "Ascension Day" },
  { date: '2026-05-25', name: "Whit Monday" },
  { date: '2026-05-27', name: "Tabaski (Eid al-Adha)" },
  { date: '2026-06-17', name: "Islamic New Year" },
  { date: '2026-07-11', name: "Tamkharit (Ashura)" },
  { date: '2026-08-15', name: "Assumption Day" },
  { date: '2026-08-26', name: "Maouloud (Milad un Nabi)" },
  { date: '2026-11-01', name: "All Saints' Day" },
  { date: '2026-12-25', name: "Christmas Day" }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Remove any existing SN holidays for 2026 just in case
data.holidays = data.holidays.filter(h => !(h.countryCode === 'SN' && h.year === 2026));

for (const h of snHolidays) {
  const slug = generateSlug(h.name);
  data.holidays.push({
    id: `sn-${slug}-2026`,
    countryCode: 'SN',
    slug: slug,
    name: h.name,
    date: h.date,
    year: 2026,
    type: "National",
    isPublicHoliday: true,
    description: `Celebrated as ${h.name} in Senegal.`,
    observanceRules: "National public holiday."
  });
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Added Senegal holidays for 2026.");
