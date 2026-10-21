const Holidays = require('date-holidays');
const hd = new Holidays();
const allCountries = hd.getCountries();
const fs = require('fs');

const appCountriesRaw = JSON.parse(fs.readFileSync('./public/data/countries.json', 'utf-8'));
const appCountryCodes = appCountriesRaw.map(c => c.id);

const americasCodes = [
  'AG', 'AR', 'BS', 'BB', 'BZ', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 
  'CU', 'DM', 'DO', 'EC', 'SV', 'GD', 'GT', 'GY', 'HT', 'HN', 'JM', 
  'MX', 'NI', 'PA', 'PY', 'PE', 'KN', 'LC', 'VC', 'SR', 'TT', 'US', 
  'UY', 'VE',
  'AI', 'AW', 'BM', 'BQ', 'KY', 'CW', 'FK', 'GF', 'GL', 'GP', 'MQ',
  'MS', 'PR', 'BL', 'MF', 'PM', 'SX', 'GS', 'TC', 'VI', 'VG'
];

const supportedButMissing = [];

for (const code of americasCodes) {
  if (!appCountryCodes.includes(code) && allCountries[code]) {
    supportedButMissing.push({ code, name: allCountries[code] });
  }
}

console.log("\n--- AMERICAS COUNTRIES MISSING IN APP BUT SUPPORTED BY date-holidays ---");
supportedButMissing.forEach(c => console.log(c.code + ': ' + c.name));
