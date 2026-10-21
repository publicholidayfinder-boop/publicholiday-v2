const fs = require('fs');
const Holidays = require('date-holidays');

const hd = new Holidays();
const allCountries = hd.getCountries();

const appCountriesRaw = JSON.parse(fs.readFileSync('./public/data/countries.json', 'utf-8'));
const appCountryCodes = appCountriesRaw.map(c => c.id);

// Comprehensive list of Asian country codes (including transcontinental & territories)
const asiaCodes = [
  'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KP', 'KR', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'OM', 'PK', 'PH', 'QA', 'RU', 'SA', 'SG', 'LK', 'SY', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE',
  'HK', 'MO', 'TW', 'PS', 'IO'
];

const supportedButMissing = [];
const missingFromLibrary = [];

for (const code of asiaCodes) {
  if (!appCountryCodes.includes(code)) {
    if (allCountries[code]) {
      supportedButMissing.push({ code, name: allCountries[code] });
    } else {
      missingFromLibrary.push(code);
    }
  }
}

console.log("\n--- ASIA COUNTRIES MISSING IN APP BUT SUPPORTED BY date-holidays ---");
if (supportedButMissing.length === 0) {
  console.log("None! All supported Asian countries are already in the app.");
} else {
  supportedButMissing.forEach(c => console.log(c.code + ': ' + c.name));
}

console.log("\n--- ASIA COUNTRIES NOT SUPPORTED BY date-holidays ---");
console.log(missingFromLibrary.join(', '));
