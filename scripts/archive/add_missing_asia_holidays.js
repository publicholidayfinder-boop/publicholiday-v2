import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal hardcoded holidays for 2026 & 2027 for Asian countries that had no API data.
const manualAsiaHolidays = {
  MY: [
    { date: '2026-01-01', name: "New Year's Day", year: 2026 },
    { date: '2026-02-17', name: "Chinese New Year", year: 2026 },
    { date: '2026-03-20', name: "Hari Raya Puasa (Eid al-Fitr)", year: 2026 },
    { date: '2026-05-01', name: "Labour Day", year: 2026 },
    { date: '2026-08-31', name: "National Day", year: 2026 },
    { date: '2026-12-25', name: "Christmas Day", year: 2026 },
    { date: '2027-01-01', name: "New Year's Day", year: 2027 },
    { date: '2027-02-06', name: "Chinese New Year", year: 2027 },
    { date: '2027-03-09', name: "Hari Raya Puasa (Eid al-Fitr)", year: 2027 },
    { date: '2027-05-01', name: "Labour Day", year: 2027 },
    { date: '2027-08-31', name: "National Day", year: 2027 },
    { date: '2027-12-25', name: "Christmas Day", year: 2027 }
  ],
  TH: [
    { date: '2026-01-01', name: "New Year's Day", year: 2026 },
    { date: '2026-04-13', name: "Songkran Festival", year: 2026 },
    { date: '2026-05-01', name: "National Labour Day", year: 2026 },
    { date: '2026-07-28', name: "King Vajiralongkorn's Birthday", year: 2026 },
    { date: '2026-12-05', name: "King Bhumibol Memorial Day", year: 2026 },
    { date: '2027-01-01', name: "New Year's Day", year: 2027 },
    { date: '2027-04-13', name: "Songkran Festival", year: 2027 },
    { date: '2027-05-01', name: "National Labour Day", year: 2027 },
    { date: '2027-07-28', name: "King Vajiralongkorn's Birthday", year: 2027 },
    { date: '2027-12-05', name: "King Bhumibol Memorial Day", year: 2027 }
  ],
  PK: [
    { date: '2026-02-05', name: "Kashmir Day", year: 2026 },
    { date: '2026-03-23', name: "Pakistan Day", year: 2026 },
    { date: '2026-05-01', name: "Labour Day", year: 2026 },
    { date: '2026-08-14', name: "Independence Day", year: 2026 },
    { date: '2026-12-25', name: "Quaid-e-Azam Day", year: 2026 },
    { date: '2027-02-05', name: "Kashmir Day", year: 2027 },
    { date: '2027-03-23', name: "Pakistan Day", year: 2027 },
    { date: '2027-05-01', name: "Labour Day", year: 2027 },
    { date: '2027-08-14', name: "Independence Day", year: 2027 },
    { date: '2027-12-25', name: "Quaid-e-Azam Day", year: 2027 }
  ],
  LK: [
    { date: '2026-01-14', name: "Tamil Thai Pongal Day", year: 2026 },
    { date: '2026-02-04', name: "National Day", year: 2026 },
    { date: '2026-04-14', name: "Sinhala and Tamil New Year", year: 2026 },
    { date: '2026-05-01', name: "May Day", year: 2026 },
    { date: '2026-12-25', name: "Christmas Day", year: 2026 },
    { date: '2027-01-14', name: "Tamil Thai Pongal Day", year: 2027 },
    { date: '2027-02-04', name: "National Day", year: 2027 },
    { date: '2027-04-14', name: "Sinhala and Tamil New Year", year: 2027 },
    { date: '2027-05-01', name: "May Day", year: 2027 },
    { date: '2027-12-25', name: "Christmas Day", year: 2027 }
  ],
  NP: [
    { date: '2026-02-18', name: "Democracy Day", year: 2026 },
    { date: '2026-04-14', name: "Nepali New Year", year: 2026 },
    { date: '2026-05-01', name: "Labour Day", year: 2026 },
    { date: '2026-09-19', name: "Constitution Day", year: 2026 },
    { date: '2027-02-18', name: "Democracy Day", year: 2027 },
    { date: '2027-04-14', name: "Nepali New Year", year: 2027 },
    { date: '2027-05-01', name: "Labour Day", year: 2027 },
    { date: '2027-09-19', name: "Constitution Day", year: 2027 }
  ],
  MM: [
    { date: '2026-01-04', name: "Independence Day", year: 2026 },
    { date: '2026-02-12', name: "Union Day", year: 2026 },
    { date: '2026-03-27', name: "Armed Forces Day", year: 2026 },
    { date: '2026-04-13', name: "Thingyan Water Festival", year: 2026 },
    { date: '2026-05-01', name: "Labour Day", year: 2026 },
    { date: '2026-07-19', name: "Martyrs' Day", year: 2026 },
    { date: '2027-01-04', name: "Independence Day", year: 2027 },
    { date: '2027-02-12', name: "Union Day", year: 2027 },
    { date: '2027-03-27', name: "Armed Forces Day", year: 2027 },
    { date: '2027-04-13', name: "Thingyan Water Festival", year: 2027 },
    { date: '2027-05-01', name: "Labour Day", year: 2027 },
    { date: '2027-07-19', name: "Martyrs' Day", year: 2027 }
  ],
  KH: [
    { date: '2026-01-01', name: "International New Year's Day", year: 2026 },
    { date: '2026-01-07', name: "Victory over Genocide Day", year: 2026 },
    { date: '2026-04-14', name: "Khmer New Year", year: 2026 },
    { date: '2026-05-01', name: "International Labour Day", year: 2026 },
    { date: '2026-09-24', name: "Constitutional Day", year: 2026 },
    { date: '2026-11-09', name: "Independence Day", year: 2026 },
    { date: '2027-01-01', name: "International New Year's Day", year: 2027 },
    { date: '2027-01-07', name: "Victory over Genocide Day", year: 2027 },
    { date: '2027-04-14', name: "Khmer New Year", year: 2027 },
    { date: '2027-05-01', name: "International Labour Day", year: 2027 },
    { date: '2027-09-24', name: "Constitutional Day", year: 2027 },
    { date: '2027-11-09', name: "Independence Day", year: 2027 }
  ],
  UZ: [
    { date: '2026-01-01', name: "New Year's Day", year: 2026 },
    { date: '2026-03-08', name: "Women's Day", year: 2026 },
    { date: '2026-03-21', name: "Navruz", year: 2026 },
    { date: '2026-05-09', name: "Day of Memory and Honour", year: 2026 },
    { date: '2026-09-01', name: "Independence Day", year: 2026 },
    { date: '2026-10-01', name: "Teachers' Day", year: 2026 },
    { date: '2027-01-01', name: "New Year's Day", year: 2027 },
    { date: '2027-03-08', name: "Women's Day", year: 2027 },
    { date: '2027-03-21', name: "Navruz", year: 2027 },
    { date: '2027-05-09', name: "Day of Memory and Honour", year: 2027 },
    { date: '2027-09-01', name: "Independence Day", year: 2027 },
    { date: '2027-10-01', name: "Teachers' Day", year: 2027 }
  ],
  AZ: [
    { date: '2026-01-01', name: "New Year's Day", year: 2026 },
    { date: '2026-03-08', name: "Women's Day", year: 2026 },
    { date: '2026-03-20', name: "Novruz", year: 2026 },
    { date: '2026-05-28', name: "Independence Day", year: 2026 },
    { date: '2026-06-15', name: "National Salvation Day", year: 2026 },
    { date: '2026-11-08', name: "Victory Day", year: 2026 },
    { date: '2027-01-01', name: "New Year's Day", year: 2027 },
    { date: '2027-03-08', name: "Women's Day", year: 2027 },
    { date: '2027-03-20', name: "Novruz", year: 2027 },
    { date: '2027-05-28', name: "Independence Day", year: 2027 },
    { date: '2027-06-15', name: "National Salvation Day", year: 2027 },
    { date: '2027-11-08', name: "Victory Day", year: 2027 }
  ],
  TW: [
    { date: '2026-01-01', name: "Republic of China Memorial Day", year: 2026 },
    { date: '2026-02-17', name: "Chinese New Year", year: 2026 },
    { date: '2026-02-28', name: "Peace Memorial Day", year: 2026 },
    { date: '2026-04-04', name: "Children's Day", year: 2026 },
    { date: '2026-05-01', name: "Labor Day", year: 2026 },
    { date: '2026-10-10', name: "National Day", year: 2026 },
    { date: '2027-01-01', name: "Republic of China Memorial Day", year: 2027 },
    { date: '2027-02-06', name: "Chinese New Year", year: 2027 },
    { date: '2027-02-28', name: "Peace Memorial Day", year: 2027 },
    { date: '2027-04-04', name: "Children's Day", year: 2027 },
    { date: '2027-05-01', name: "Labor Day", year: 2027 },
    { date: '2027-10-10', name: "National Day", year: 2027 }
  ]
};

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

for (const [countryCode, holidays] of Object.entries(manualAsiaHolidays)) {
  // Clear any existing entries for 2026/2027 for safety
  data.holidays = data.holidays.filter(h => !(h.countryCode === countryCode && (h.year === 2026 || h.year === 2027)));

  for (const h of holidays) {
    const slug = generateSlug(h.name);
    data.holidays.push({
      id: `${countryCode.toLowerCase()}-${slug}-${h.year}`,
      countryCode: countryCode,
      slug: slug,
      name: h.name,
      date: h.date,
      year: h.year,
      type: "National",
      isPublicHoliday: true,
      description: `Celebrated as ${h.name} in ${countryCode}.`,
      observanceRules: "National public holiday."
    });
  }
  console.log(`Added manual holidays for ${countryCode} (2026 & 2027)`);
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Done. All missing Asian holidays added.");
