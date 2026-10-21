const fs = require('fs');

const path = './src/lib/timezones.js';
let content = fs.readFileSync(path, 'utf-8');

if (!content.includes("'GL':")) {
    content = content.replace(/export const multiTimezoneCountries = \{/, "export const multiTimezoneCountries = {\n    'GL': ['Nuuk (WGT)', 'Thule (AST)', 'Ittoqqortoormiit (EGT)', 'Danmarkshavn (GMT)'],");
    fs.writeFileSync(path, content);
    console.log('Added GL to multiTimezoneCountries');
}
