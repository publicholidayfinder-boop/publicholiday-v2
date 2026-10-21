const fs = require('fs');
const path = './src/lib/timezones.js';
let content = fs.readFileSync(path, 'utf-8');

const mapping = {
  'BH': 'Asia/Bahrain',
  'BN': 'Asia/Brunei',
  'IR': 'Asia/Tehran',
  'IL': 'Asia/Jerusalem',
  'SA': 'Asia/Riyadh',
  'AE': 'Asia/Dubai'
};

for (const [code, tz] of Object.entries(mapping)) {
    if (!content.includes("'" + code + "':")) {
        content = content.replace(/export const countryTimezones = \{/, "export const countryTimezones = {\n    '" + code + "': '" + tz + "',");
    }
}

fs.writeFileSync(path, content);
console.log('timezones.js updated for Asian countries.');
