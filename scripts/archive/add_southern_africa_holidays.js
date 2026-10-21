import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const southernAfricanCountries = [
  { id: 'NA', name: 'Namibia', emoji: '🇳🇦' },
  { id: 'BW', name: 'Botswana', emoji: '🇧🇼' },
  { id: 'ZW', name: 'Zimbabwe', emoji: '🇿🇼' },
  { id: 'MZ', name: 'Mozambique', emoji: '🇲🇿' },
  { id: 'LS', name: 'Lesotho', emoji: '🇱🇸' },
  { id: 'SZ', name: 'Eswatini', emoji: '🇸🇿' },
  { id: 'AO', name: 'Angola', emoji: '🇦🇴' },
  { id: 'ZM', name: 'Zambia', emoji: '🇿🇲' },
  { id: 'MW', name: 'Malawi', emoji: '🇲🇼' },
  { id: 'MG', name: 'Madagascar', emoji: '🇲🇬' }
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function fetchHolidays(year, countryCode) {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

// Fallback manual holidays for 2026/2027 if API fails or returns 0
const fallbackHolidays = {
  2026: [
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-05-01', name: "Workers' Day" },
    { date: '2026-12-25', name: "Christmas Day" }
  ],
  2027: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-05-01', name: "Workers' Day" },
    { date: '2027-12-25', name: "Christmas Day" }
  ]
};

async function processCountries() {
  for (const country of southernAfricanCountries) {
    let countryExists = data.countries.find(c => c.id === country.id);
    if (!countryExists) {
      countryExists = {
        id: country.id,
        name: country.name,
        description: {
          en: `${country.name} observes a range of public holidays reflecting its national history, culture, and traditions. These holidays affect work schedules, school terms, and travel plans across the country.`
        },
        sections: [
          {
            title: "Important Notice",
            content: `Public holiday dates and observance rules can change, especially when holidays fall on weekends. Always confirm critical dates with official ${country.name} government sources when planning travel, payroll, or business operations.`
          },
          {
            title: `How ${country.name}'s Public Holidays Are Observed`,
            content: `On most public and bank holidays:\n\nBanks and government offices are closed.\nSchools are closed.\nSome businesses operate reduced hours.\nPublic transport and retail services may run modified schedules.\nPrivate businesses are not legally required to close but often adjust operating hours.`
          },
          {
            title: `Why ${country.name}'s Public Holidays Matter`,
            content: `Understanding ${country.name}'s public holidays helps with:\n\nBusiness and payroll planning.\nSchool and academic scheduling.\nTravel and accommodation planning.\nAvoiding service disruptions.\nBoth residents and visitors benefit from knowing when closures and peak travel periods are likely.`
          },
          {
            title: "Frequently Asked Questions",
            items: [
              {
                q: `Are ${country.name}'s public holidays the same across all regions?`,
                a: `Many holidays are shared nationwide, but some dates or specific observances may differ by region or state.`
              },
              {
                q: "Do all businesses close on public holidays?",
                a: "No. Many private businesses remain open, though operating hours may be reduced."
              },
              {
                q: "Can public holiday dates change?",
                a: "Yes. Especially when holidays fall on weekends, are based on lunar calendars, or during special national events."
              }
            ]
          }
        ]
      };
      data.countries.push(countryExists);
    }

    for (const year of [2026, 2027]) {
      // Remove existing data for this country/year
      data.holidays = data.holidays.filter(h => !(h.countryCode === country.id && h.year === year));

      let apiHolidays = await fetchHolidays(year, country.id);
      
      if (apiHolidays.length === 0) {
        apiHolidays = fallbackHolidays[year];
        console.log(`Using fallback holidays for ${country.id} ${year}`);
      } else {
        console.log(`Fetched ${apiHolidays.length} holidays for ${country.id} ${year}`);
      }

      for (const h of apiHolidays) {
        const hName = h.localName || h.name;
        const slug = generateSlug(hName);
        data.holidays.push({
          id: `${country.id.toLowerCase()}-${slug}-${year}`,
          countryCode: country.id,
          slug: slug,
          name: hName,
          date: h.date,
          year: year,
          type: "National",
          isPublicHoliday: true,
          description: `Celebrated as ${hName} in ${country.name}.`,
          observanceRules: "National public holiday."
        });
      }
    }
  }

  fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("Done adding Southern African countries.");
}

processCountries();
