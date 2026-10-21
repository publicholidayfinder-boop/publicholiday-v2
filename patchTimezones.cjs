const fs = require('fs');

const path = './src/lib/timezones.js';
let content = fs.readFileSync(path, 'utf-8');

const mapping = {
  'AI': 'America/Anguilla',
  'AW': 'America/Aruba',
  'BM': 'Atlantic/Bermuda',
  'BQ': 'America/Kralendijk',
  'KY': 'America/Cayman',
  'CW': 'America/Curacao',
  'GF': 'America/Cayenne',
  'GL': 'America/Nuuk',
  'GP': 'America/Guadeloupe',
  'MQ': 'America/Martinique',
  'MS': 'America/Montserrat',
  'PR': 'America/Puerto_Rico',
  'BL': 'America/St_Barthelemy',
  'MF': 'America/Marigot',
  'PM': 'America/Miquelon',
  'SX': 'America/Lower_Princes',
  'TC': 'America/Grand_Turk',
  'VI': 'America/St_Thomas',
  'VG': 'America/Tortola'
};

for (const [code, tz] of Object.entries(mapping)) {
    if (!content.includes("'" + code + "':")) {
        content = content.replace(/export const countryTimezones = \{/, "export const countryTimezones = {\n    '" + code + "': '" + tz + "',");
    }
}

fs.writeFileSync(path, content);
console.log('timezones.js updated.');
