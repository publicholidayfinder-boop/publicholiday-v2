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
    // Fix FAQ item Q
    if (country.sections && country.sections.length >= 4) {
      const faqSection = country.sections[3];
      if (faqSection.items && faqSection.items.length > 0) {
        if (faqSection.items[0].q.includes(`Are ${country.name} public holidays`)) {
          faqSection.items[0].q = `Are ${country.name}'s public holidays the same across all regions?`;
        }
      }
    }
  }
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Done updating Asian country FAQ titles.");
