const fs = require('fs');
const filePath = 'src/lib/continents.js';
let content = fs.readFileSync(filePath, 'utf8');

const additions = {
    'BI': 'Africa', // Burundi
    'KM': 'Africa', // Comoros
    'DJ': 'Africa', // Djibouti
    'ER': 'Africa', // Eritrea
    'ET': 'Africa', // Ethiopia
    'KE': 'Africa', // Kenya
    'MU': 'Africa', // Mauritius
    'RW': 'Africa', // Rwanda
    'SC': 'Africa', // Seychelles
    'SO': 'Africa', // Somalia
    'TZ': 'Africa', // Tanzania
    'UG': 'Africa', // Uganda
    'LY': 'Africa', // Libya
    'SD': 'Africa', // Sudan
    'ST': 'Africa'  // Sao Tome and Principe
};

const lines = content.split('\n');
const insertIndex = lines.findIndex(l => l.includes('};'));
if (insertIndex > -1) {
    for (const [code, continent] of Object.entries(additions)) {
        if (!content.includes(`'${code}':`)) {
            lines.splice(insertIndex, 0, `    '${code}': '${continent}',`);
        }
    }
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Added countries to continents.js');
} else {
    console.log('Could not find insert point.');
}
