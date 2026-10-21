const fs = require('fs');

// 1. Patch continents.js
const continentsPath = './src/lib/continents.js';
let continents = fs.readFileSync(continentsPath, 'utf-8');

const oceaniaMap = {
  'FJ': 'Oceania', 'NZ': 'Oceania', 'TO': 'Oceania', 'VU': 'Oceania',
  'AS': 'Oceania', 'CK': 'Oceania', 'GU': 'Oceania', 'NC': 'Oceania',
  'NF': 'Oceania', 'PF': 'Oceania', 'WF': 'Oceania', 'CC': 'Oceania', 'CX': 'Oceania'
};

for (const [code, continent] of Object.entries(oceaniaMap)) {
    if (!continents.includes("'" + code + "':")) {
        continents = continents.replace("'AU': 'Oceania',", "'AU': 'Oceania',\n    '" + code + "': 'Oceania',");
    }
}
fs.writeFileSync(continentsPath, continents);
console.log('continents.js updated.');

// 2. Patch timezones.js
const timezonesPath = './src/lib/timezones.js';
let timezones = fs.readFileSync(timezonesPath, 'utf-8');

const tzMap = {
  'FJ': 'Pacific/Fiji',
  'NZ': 'Pacific/Auckland',
  'TO': 'Pacific/Tongatapu',
  'VU': 'Pacific/Efate',
  'AS': 'Pacific/Pago_Pago',
  'CK': 'Pacific/Rarotonga',
  'GU': 'Pacific/Guam',
  'NC': 'Pacific/Noumea',
  'NF': 'Pacific/Norfolk',
  'PF': 'Pacific/Tahiti',
  'WF': 'Pacific/Wallis',
  'CC': 'Indian/Cocos',
  'CX': 'Indian/Christmas'
};

for (const [code, tz] of Object.entries(tzMap)) {
    if (!timezones.includes("'" + code + "':")) {
        timezones = timezones.replace('export const countryTimezones = {', "export const countryTimezones = {\n    '" + code + "': '" + tz + "',");
    }
}
fs.writeFileSync(timezonesPath, timezones);
console.log('timezones.js updated.');
