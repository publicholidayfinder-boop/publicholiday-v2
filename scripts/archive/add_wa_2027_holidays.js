import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2027 Islamic holiday estimates (shift ~11 days earlier each year):
// Eid al-Fitr:       ~March 9, 2027
// Eid al-Adha:       ~May 17, 2027
// Islamic New Year:  ~June 6, 2027
// Mawlid:            ~August 15, 2027

const holidays2027 = {
  SN: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-03-09', name: "Korité (Eid al-Fitr)" },
    { date: '2027-04-04', name: "Independence Day" },
    { date: '2027-04-05', name: "Easter Monday" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-05-13', name: "Ascension Day" },
    { date: '2027-05-17', name: "Tabaski (Eid al-Adha)" },
    { date: '2027-05-24', name: "Whit Monday" },
    { date: '2027-06-06', name: "Islamic New Year" },
    { date: '2027-06-30', name: "Tamkharit (Ashura)" },
    { date: '2027-08-15', name: "Assumption Day" },
    { date: '2027-08-15', name: "Maouloud (Milad un Nabi)" },
    { date: '2027-11-01', name: "All Saints' Day" },
    { date: '2027-12-25', name: "Christmas Day" }
  ],
  MR: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-03-09', name: "Eid al-Fitr" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-05-17', name: "Eid al-Adha" },
    { date: '2027-05-25', name: "Africa Day" },
    { date: '2027-06-06', name: "Islamic New Year" },
    { date: '2027-08-15', name: "Prophet's Birthday (Mawlid)" },
    { date: '2027-11-28', name: "Independence Day" }
  ],
  CV: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-01-13', name: "Democracy Day" },
    { date: '2027-01-20', name: "Heroes' Day" },
    { date: '2027-02-10', name: "Ash Wednesday" },
    { date: '2027-03-28', name: "Easter Sunday" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-07-05', name: "Independence Day" },
    { date: '2027-08-15', name: "Assumption Day" },
    { date: '2027-11-01', name: "All Saints' Day" },
    { date: '2027-12-25', name: "Christmas Day" }
  ],
  CI: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-03-09', name: "Eid al-Fitr (End of Ramadan)" },
    { date: '2027-03-29', name: "Easter Monday" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-05-13', name: "Ascension Day" },
    { date: '2027-05-17', name: "Eid al-Adha (Tabaski)" },
    { date: '2027-05-24', name: "Whit Monday" },
    { date: '2027-08-07', name: "Independence Day" },
    { date: '2027-08-15', name: "Assumption Day" },
    { date: '2027-08-15', name: "The Prophet's Birthday (Mawlid)" },
    { date: '2027-11-01', name: "All Saints' Day" },
    { date: '2027-11-15', name: "National Peace Day" },
    { date: '2027-12-25', name: "Christmas Day" }
  ],
  ML: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-01-20', name: "Armed Forces Day" },
    { date: '2027-03-09', name: "Eid al-Fitr" },
    { date: '2027-03-26', name: "Martyrs' Day" },
    { date: '2027-03-29', name: "Easter Monday" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-05-17', name: "Eid al-Adha" },
    { date: '2027-05-25', name: "Africa Day" },
    { date: '2027-06-06', name: "Islamic New Year" },
    { date: '2027-08-15', name: "Prophet's Birthday (Mawlid)" },
    { date: '2027-09-22', name: "Independence Day" },
    { date: '2027-12-25', name: "Christmas Day" }
  ],
  SL: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-03-09', name: "Eid al-Fitr" },
    { date: '2027-03-26', name: "Good Friday" },
    { date: '2027-03-29', name: "Easter Monday" },
    { date: '2027-04-27', name: "Independence Day" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-05-17', name: "Eid al-Adha" },
    { date: '2027-08-15', name: "Prophet's Birthday (Mawlid)" },
    { date: '2027-12-25', name: "Christmas Day" },
    { date: '2027-12-26', name: "Boxing Day" }
  ],
  GN: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-03-09', name: "Eid al-Fitr" },
    { date: '2027-03-26', name: "Good Friday" },
    { date: '2027-03-29', name: "Easter Monday" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-05-17', name: "Eid al-Adha" },
    { date: '2027-05-25', name: "Africa Day" },
    { date: '2027-06-06', name: "Islamic New Year" },
    { date: '2027-08-15', name: "Prophet's Birthday (Mawlid)" },
    { date: '2027-10-02', name: "Independence Day" },
    { date: '2027-11-01', name: "All Saints' Day" },
    { date: '2027-12-25', name: "Christmas Day" }
  ],
  GW: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-01-20', name: "Heroes' Day" },
    { date: '2027-03-08', name: "International Women's Day" },
    { date: '2027-03-09', name: "Eid al-Fitr" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-05-17', name: "Eid al-Adha" },
    { date: '2027-06-06', name: "Islamic New Year" },
    { date: '2027-08-03', name: "Colonialism Overthrow Day" },
    { date: '2027-08-15', name: "Prophet's Birthday (Mawlid)" },
    { date: '2027-09-12', name: "National Day / Re-Adjustment Movement Day" },
    { date: '2027-11-14', name: "Independence Day Proclamation" },
    { date: '2027-12-25', name: "Christmas Day" }
  ],
  LR: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-02-11', name: "Armed Forces Day" },
    { date: '2027-03-15', name: "J.J. Roberts' Birthday" },
    { date: '2027-03-26', name: "Good Friday" },
    { date: '2027-03-29', name: "Easter Monday" },
    { date: '2027-05-01', name: "Fast and Prayer Day" },
    { date: '2027-05-14', name: "National Unification Day" },
    { date: '2027-07-26', name: "Independence Day" },
    { date: '2027-08-24', name: "Flag Day" },
    { date: '2027-11-01', name: "All Saints' Day" },
    { date: '2027-11-07', name: "Election Day" },
    { date: '2027-11-29', name: "President W.V.S. Tubman's Birthday" },
    { date: '2027-12-25', name: "Christmas Day" }
  ],
  BF: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-01-03', name: "Revolution Day" },
    { date: '2027-03-08', name: "International Women's Day" },
    { date: '2027-03-09', name: "Eid al-Fitr" },
    { date: '2027-03-29', name: "Easter Monday" },
    { date: '2027-05-01', name: "Labour Day" },
    { date: '2027-05-13', name: "Ascension Day" },
    { date: '2027-05-17', name: "Eid al-Adha" },
    { date: '2027-05-24', name: "Whit Monday" },
    { date: '2027-05-25', name: "Africa Day" },
    { date: '2027-08-05', name: "Independence Day" },
    { date: '2027-08-15', name: "Assumption Day" },
    { date: '2027-08-15', name: "Prophet's Birthday (Mawlid)" },
    { date: '2027-11-01', name: "All Saints' Day" },
    { date: '2027-12-11', name: "Proclamation of the Republic Day" },
    { date: '2027-12-25', name: "Christmas Day" }
  ]
};

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

for (const [countryCode, holidays] of Object.entries(holidays2027)) {
  // Remove any existing 2027 entries for this country
  data.holidays = data.holidays.filter(h => !(h.countryCode === countryCode && h.year === 2027));

  for (const h of holidays) {
    const slug = generateSlug(h.name);
    data.holidays.push({
      id: `${countryCode.toLowerCase()}-${slug}-2027`,
      countryCode: countryCode,
      slug: slug,
      name: h.name,
      date: h.date,
      year: 2027,
      type: "National",
      isPublicHoliday: true,
      description: `Celebrated as ${h.name} in ${countryCode}.`,
      observanceRules: "National public holiday."
    });
  }

  console.log(`Added 2027 holidays for ${countryCode}`);
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Done. All 2027 holidays added for West African countries.");
