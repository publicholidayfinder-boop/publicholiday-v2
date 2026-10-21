const fs = require('fs');
const Holidays = require('date-holidays');

const hd = new Holidays();
const allCountries = hd.getCountries();

const appCountriesRaw = JSON.parse(fs.readFileSync('./public/data/countries.json', 'utf-8'));
const appCountryCodes = appCountriesRaw.map(c => c.id);

// All Oceania sovereign nations + territories
const oceaniaCodes = [
  // Sovereign nations
  'AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU',
  // Territories & dependencies
  'AS', 'CK', 'GU', 'NC', 'NF', 'NU', 'MP', 'PF', 'PN', 'TK', 'WF',
  'CC', 'CX', 'HM'
];

const supportedButMissing = [];
const notSupported = [];

for (const code of oceaniaCodes) {
  if (!appCountryCodes.includes(code)) {
    if (allCountries[code]) {
      supportedButMissing.push({ code, name: allCountries[code] });
    } else {
      notSupported.push(code);
    }
  }
}

console.log('\n--- IN APP ---');
const inApp = oceaniaCodes.filter(c => appCountryCodes.includes(c));
inApp.forEach(c => console.log(c + ': ' + (allCountries[c] || 'n/a')));

console.log('\n--- MISSING BUT SUPPORTED by date-holidays ---');
if (supportedButMissing.length === 0) console.log('None!');
else supportedButMissing.forEach(c => console.log(c.code + ': ' + c.name));

console.log('\n--- MISSING AND NOT SUPPORTED by date-holidays ---');
if (notSupported.length === 0) console.log('None!');
else console.log(notSupported.join(', '));
