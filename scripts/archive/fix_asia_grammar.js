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
    // Check if sections exist and update the titles for grammatical correctness
    if (country.sections && country.sections.length >= 3) {
      if (country.sections[1].title.includes(`How ${country.name} Public Holidays`)) {
        country.sections[1].title = `How ${country.name}'s Public Holidays Are Observed`;
      }
      if (country.sections[2].title.includes(`Why ${country.name} Public Holidays`)) {
        country.sections[2].title = `Why ${country.name}'s Public Holidays Matter`;
      }
    }
    
    console.log(`Fixed section title style for ${country.name} (${country.id})`);
  }
}

fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Done updating Asian country section titles.");
