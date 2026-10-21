import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');

const countriesData = [
  {
    id: "CM",
    name: "Cameroon",
    description: "Cameroon observes several public holidays each year that reflect its rich cultural heritage, religious diversity, and history. These holidays include national events, Christian feasts, and Islamic celebrations, which influence public and private sector operations across the country."
  },
  {
    id: "CF",
    name: "Central African Republic",
    description: "The Central African Republic observes a series of public holidays that commemorate significant historical milestones, national figures, and major Christian and Islamic religious events. These holidays play a key role in national unity and cultural identity."
  },
  {
    id: "TD",
    name: "Chad",
    description: "Chad's public holidays consist of national events honoring its sovereignty and leaders, along with religious celebrations observed by its diverse Muslim and Christian populations. These holidays shape business and government activities throughout the country."
  },
  {
    id: "CG",
    name: "Republic of the Congo",
    description: "The Republic of the Congo (Congo-Brazzaville) observes national public holidays that celebrate its independence, historical milestones, and religious heritage. These official non-working days affect public services, banks, and schools."
  },
  {
    id: "CD",
    name: "Democratic Republic of the Congo",
    description: "The Democratic Republic of the Congo observes statutory public holidays that commemorate key political leaders, historical transitions, and national struggles, alongside major religious events. These holidays are observed nationwide by schools and businesses."
  },
  {
    id: "GQ",
    name: "Equatorial Guinea",
    description: "Equatorial Guinea's public holidays are established by law to celebrate its independence, political foundations, and strong Roman Catholic tradition. These holidays involve closures of public offices, educational institutions, and many local businesses."
  },
  {
    id: "GA",
    name: "Gabon",
    description: "Gabon observes several public holidays that mark key moments in its political development, women's and workers' rights, and Christian celebrations. These official holidays impact commercial schedules and public service availability across the nation."
  },
  {
    id: "ST",
    name: "São Tomé and Príncipe",
    description: "São Tomé and Príncipe observes national public holidays that celebrate its liberation from colonial rule, agricultural reforms, and cultural history. These holidays are observed across the archipelago's islands."
  }
];

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Build standard sections for a country profile
function buildSections(countryName) {
  return [
    {
      title: `How Public Holidays Are Observed in ${countryName}`,
      content: `On public holidays, government offices and public schools are closed, and banks/financial institutions typically close. Private businesses may operate reduced hours. Travel activity often increases around major religious and national holidays.`
    },
    {
      title: `Why ${countryName}’s Public Holidays Matter`,
      content: `Knowing ${countryName}’s public holidays helps with business planning and payroll management, school and academic scheduling, and travel/accommodation planning. Both residents and visitors benefit from understanding when services may be unavailable.`
    },
    {
      title: "Frequently Asked Questions",
      items: [
        {
          q: `Are public holidays observed nationwide in ${countryName}?`,
          a: `Yes. Official public holidays apply across all regions.`
        },
        {
          q: "Do all businesses close on public holidays?",
          a: "Government offices close. Private businesses may operate limited hours."
        },
        {
          q: "Can additional holidays be declared?",
          a: `Yes. The government of ${countryName} may declare additional public holidays when necessary.`
        }
      ]
    }
  ];
}

// Generate holidays list for CM, CF, TD, CG, CD, GQ, GA, ST for 2026-2028
function getHolidaysForYear(year) {
  // Easter-based movable holiday calculations
  const easterDates = {
    2026: { easter: '2026-04-05', goodFriday: '2026-04-03', easterMonday: '2026-04-06', ascension: '2026-05-14', whitMonday: '2026-05-25', corpusChristi: '2026-06-04' },
    2027: { easter: '2027-03-28', goodFriday: '2027-03-26', easterMonday: '2027-03-29', ascension: '2027-05-06', whitMonday: '2027-05-17', corpusChristi: '2027-05-27' },
    2028: { easter: '2028-04-16', goodFriday: '2028-04-14', easterMonday: '2028-04-17', ascension: '2028-05-25', whitMonday: '2028-06-05', corpusChristi: '2028-06-15' }
  };
  
  const islamicDates = {
    2026: { fitr: '2026-03-20', adha: '2026-05-27' },
    2027: { fitr: '2027-03-10', adha: '2027-05-16' },
    2028: { fitr: '2028-02-27', adha: '2028-05-05' }
  };

  const ed = easterDates[year];
  const id = islamicDates[year];

  const list = [];

  // --- CM: Cameroon ---
  const cmHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "National" },
    { name: "Youth Day", date: `${year}-02-11`, type: "National" },
    { name: "Good Friday", date: ed.goodFriday, type: "Christian" },
    { name: "Easter Monday", date: ed.easterMonday, type: "Christian" },
    { name: "Labour Day", date: `${year}-05-01`, type: "National" },
    { name: "Ascension Day", date: ed.ascension, type: "Christian" },
    { name: "National Day", date: `${year}-05-20`, type: "National" },
    { name: "Assumption Day", date: `${year}-08-15`, type: "Christian" },
    { name: "Christmas Day", date: `${year}-12-25`, type: "Christian" },
    { name: "Eid-Ul-Fitr", date: id.fitr, type: "Islamic" },
    { name: "Eid-Ul-Adha", date: id.adha, type: "Islamic" }
  ];
  cmHolidays.forEach(h => list.push({ ...h, countryCode: "CM" }));

  // --- CF: Central African Republic ---
  const cfHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "National" },
    { name: "Barthelemy Boganda Day", date: `${year}-03-29`, type: "National" },
    { name: "Easter Monday", date: ed.easterMonday, type: "Christian" },
    { name: "Labour Day", date: `${year}-05-01`, type: "National" },
    { name: "Ascension Day", date: ed.ascension, type: "Christian" },
    { name: "Whit Monday", date: ed.whitMonday, type: "Christian" },
    { name: "General Prayer Day", date: `${year}-06-30`, type: "National" },
    { name: "Independence Day", date: `${year}-08-13`, type: "National" },
    { name: "Assumption Day", date: `${year}-08-15`, type: "Christian" },
    { name: "All Saints' Day", date: `${year}-11-01`, type: "Christian" },
    { name: "Republic Day", date: `${year}-12-01`, type: "National" },
    { name: "Christmas Day", date: `${year}-12-25`, type: "Christian" },
    { name: "Eid-Ul-Fitr", date: id.fitr, type: "Islamic" },
    { name: "Eid-Ul-Adha", date: id.adha, type: "Islamic" }
  ];
  cfHolidays.forEach(h => list.push({ ...h, countryCode: "CF" }));

  // --- TD: Chad ---
  const tdHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "National" },
    { name: "International Women's Day", date: `${year}-03-08`, type: "National" },
    { name: "Easter Monday", date: ed.easterMonday, type: "Christian" },
    { name: "Labour Day", date: `${year}-05-01`, type: "National" },
    { name: "Independence Day", date: `${year}-08-11`, type: "National" },
    { name: "All Saints' Day", date: `${year}-11-01`, type: "Christian" },
    { name: "Republic Day", date: `${year}-11-28`, type: "National" },
    { name: "Freedom and Democracy Day", date: `${year}-12-01`, type: "National" },
    { name: "Christmas Day", date: `${year}-12-25`, type: "Christian" },
    { name: "Eid-Ul-Fitr", date: id.fitr, type: "Islamic" },
    { name: "Eid-Ul-Adha", date: id.adha, type: "Islamic" }
  ];
  tdHolidays.forEach(h => list.push({ ...h, countryCode: "TD" }));

  // --- CG: Republic of the Congo ---
  const cgHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "National" },
    { name: "Easter Sunday", date: ed.easter, type: "Christian" },
    { name: "Easter Monday", date: ed.easterMonday, type: "Christian" },
    { name: "Labour Day", date: `${year}-05-01`, type: "National" },
    { name: "Ascension Day", date: ed.ascension, type: "Christian" },
    { name: "Whit Monday", date: ed.whitMonday, type: "Christian" },
    { name: "Reconciliation Day", date: `${year}-06-10`, type: "National" },
    { name: "National Day", date: `${year}-08-15`, type: "National" },
    { name: "All Saints' Day", date: `${year}-11-01`, type: "Christian" },
    { name: "Republic Day", date: `${year}-11-28`, type: "National" },
    { name: "Christmas Day", date: `${year}-12-25`, type: "Christian" }
  ];
  cgHolidays.forEach(h => list.push({ ...h, countryCode: "CG" }));

  // --- CD: Democratic Republic of the Congo ---
  const cdHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "National" },
    { name: "Martyrs Day", date: `${year}-01-04`, type: "National" },
    { name: "Laurent-Désiré Kabila Assassination", date: `${year}-01-16`, type: "National" },
    { name: "Patrice Lumumba Assassination", date: `${year}-01-17`, type: "National" },
    { name: "Kimbangu's Day", date: `${year}-04-06`, type: "National" },
    { name: "Labour Day", date: `${year}-05-01`, type: "National" },
    { name: "Liberation Day", date: `${year}-05-17`, type: "National" },
    { name: "Independence Day", date: `${year}-06-30`, type: "National" },
    { name: "Parents' Day", date: `${year}-08-01`, type: "National" },
    { name: "Congolese Genocide Day", date: `${year}-08-02`, type: "National" },
    { name: "Christmas Day", date: `${year}-12-25`, type: "Christian" }
  ];
  cdHolidays.forEach(h => list.push({ ...h, countryCode: "CD" }));

  // --- GQ: Equatorial Guinea ---
  const gqHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "National" },
    { name: "Good Friday", date: ed.goodFriday, type: "Christian" },
    { name: "Labour Day", date: `${year}-05-01`, type: "National" },
    { name: "Corpus Christi", date: ed.corpusChristi, type: "Christian" },
    { name: "President's Day", date: `${year}-06-05`, type: "National" },
    { name: "Freedom Day", date: `${year}-08-03`, type: "National" },
    { name: "Constitution Day", date: `${year}-08-15`, type: "National" },
    { name: "Independence Day", date: `${year}-10-12`, type: "National" },
    { name: "Immaculate Conception", date: `${year}-08-12` ? `${year}-12-08` : `${year}-12-08`, type: "Christian" }, // Fix: standard date is Dec 8
    { name: "Christmas Day", date: `${year}-12-25`, type: "Christian" }
  ];
  gqHolidays.forEach(h => list.push({ ...h, countryCode: "GQ" }));

  // --- GA: Gabon ---
  const gaHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "National" },
    { name: "Renovation Day", date: `${year}-03-12`, type: "National" },
    { name: "Easter Monday", date: ed.easterMonday, type: "Christian" },
    { name: "Women's Day", date: `${year}-04-17`, type: "National" },
    { name: "Labour Day", date: `${year}-05-01`, type: "National" },
    { name: "Martyr's Day", date: `${year}-05-06`, type: "National" },
    { name: "Whit Monday", date: ed.whitMonday, type: "Christian" },
    { name: "Assumption Day", date: `${year}-08-15`, type: "Christian" },
    { name: "Independence Day", date: `${year}-08-17`, type: "National" },
    { name: "All Saints' Day", date: `${year}-11-01`, type: "Christian" },
    { name: "Christmas Day", date: `${year}-12-25`, type: "Christian" }
  ];
  gaHolidays.forEach(h => list.push({ ...h, countryCode: "GA" }));

  // --- ST: São Tomé and Príncipe ---
  const stHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "National" },
    { name: "King Amador Day", date: `${year}-01-04`, type: "National" },
    { name: "Martyrs' Day", date: `${year}-02-03`, type: "National" },
    { name: "Labour Day", date: `${year}-05-01`, type: "National" },
    { name: "Independence Day", date: `${year}-07-12`, type: "National" },
    { name: "Armed Forces Day", date: `${year}-09-06`, type: "National" },
    { name: "Agricultural Reform Day", date: `${year}-09-30`, type: "National" },
    { name: "São Tomé Day", date: `${year}-12-21`, type: "National" },
    { name: "Christmas Day", date: `${year}-12-25`, type: "Christian" }
  ];
  stHolidays.forEach(h => list.push({ ...h, countryCode: "ST" }));

  return list;
}

function run() {
  console.log('Reading src/data/holidays.json...');
  const fileContent = fs.readFileSync(holidaysFilePath, 'utf8');
  const dbData = JSON.parse(fileContent);

  // 1. Process countries list
  const countryIds = countriesData.map(c => c.id);
  // Remove existing copies of these countries if any
  dbData.countries = dbData.countries.filter(c => !countryIds.includes(c.id));

  // Push new country profiles
  countriesData.forEach(country => {
    dbData.countries.push({
      id: country.id,
      name: country.name,
      description: { en: country.description },
      sections: buildSections(country.name)
    });
    console.log(`Added country profile: ${country.name} (${country.id})`);
  });

  // 2. Process holidays list
  // Remove existing copies of these holidays if any
  dbData.holidays = dbData.holidays.filter(h => !countryIds.includes(h.countryCode));

  const years = [2026, 2027, 2028];
  years.forEach(year => {
    const list = getHolidaysForYear(year);
    list.forEach(h => {
      const slug = generateSlug(h.name);
      dbData.holidays.push({
        id: `${h.countryCode.toLowerCase()}-${slug}-${year}`,
        countryCode: h.countryCode,
        slug: slug,
        name: h.name,
        date: h.date,
        year: year,
        type: h.type,
        isPublicHoliday: true,
        description: `${h.name} is a public holiday in ${countriesData.find(c => c.id === h.countryCode).name}.`,
        observanceRules: "National public holiday."
      });
    });
    console.log(`Added ${list.length} holidays for year ${year}`);
  });

  // 3. Save holidays.json
  console.log('Saving src/data/holidays.json...');
  fs.writeFileSync(holidaysFilePath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log('✅ src/data/holidays.json updated successfully!');
}

run();
