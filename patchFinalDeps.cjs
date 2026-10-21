const fs = require('fs');
let continents = fs.readFileSync('src/lib/continents.js', 'utf-8');

const additions = `
    'AX': 'Europe',
    'FO': 'Europe',
    'GG': 'Europe',
    'GI': 'Europe',
    'IC': 'Europe',
    'IM': 'Europe',
    'JE': 'Europe',
    'SJ': 'Europe',
    'EH': 'Africa',
    'RE': 'Africa',
    'SH': 'Africa',
    'YT': 'Africa',
`;
continents = continents.replace("export const countryToContinent = {", "export const countryToContinent = {" + additions);
fs.writeFileSync('src/lib/continents.js', continents, 'utf-8');
console.log('Continents mapped.');

let timezones = fs.readFileSync('src/lib/timezones.js', 'utf-8');
const tzAdditions = `
    'AX': 'Europe/Mariehamn',
    'FO': 'Atlantic/Faroe',
    'GG': 'Europe/Guernsey',
    'GI': 'Europe/Gibraltar',
    'IC': 'Atlantic/Canary',
    'IM': 'Europe/Isle_of_Man',
    'JE': 'Europe/Jersey',
    'SJ': 'Arctic/Longyearbyen',
    'EH': 'Africa/El_Aaiun',
    'RE': 'Indian/Reunion',
    'SH': 'Atlantic/St_Helena',
    'YT': 'Indian/Mayotte',
`;
timezones = timezones.replace("export const countryTimezones = {", "export const countryTimezones = {" + tzAdditions);
fs.writeFileSync('src/lib/timezones.js', timezones, 'utf-8');
console.log('Timezones mapped.');
