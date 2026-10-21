import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const asianCountriesList = [
  'CN', 'KR', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'BD', 'PK', 
  'LK', 'NP', 'MM', 'KH', 'MN', 'KZ', 'UZ', 'AZ', 'GE', 'AM', 
  'HK', 'TW'
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

for (const country of data.countries) {
  if (asianCountriesList.includes(country.id)) {
    
    // Ensure description is an object with 'en' at least
    if (typeof country.description === 'string') {
      country.description = { en: country.description };
    }

    country.sections = [
      {
        title: "Important Notice",
        content: `Public holiday dates and observance rules can change, especially when holidays fall on weekends. Always confirm critical dates with official ${country.name} government sources when planning travel, payroll, or business operations.`
      },
      {
        title: `How ${country.name} Public Holidays Are Observed`,
        content: `On most public and bank holidays:\n\nBanks and government offices are closed.\nSchools are closed.\nSome businesses operate reduced hours.\nPublic transport and retail services may run modified schedules.\nPrivate businesses are not legally required to close but often adjust operating hours.`
      },
      {
        title: `Why ${country.name} Public Holidays Matter`,
        content: `Understanding ${country.name} public holidays helps with:\n\nBusiness and payroll planning.\nSchool and academic scheduling.\nTravel and accommodation planning.\nAvoiding service disruptions.\nBoth residents and visitors benefit from knowing when closures and peak travel periods are likely.`
      },
      {
        title: "Frequently Asked Questions",
        items: [
          {
            q: `Are ${country.name} public holidays the same across all regions?`,
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
    ];
    
    console.log(`Fixed layout for ${country.name} (${country.id})`);
  }
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Done updating Asian country layouts.");
