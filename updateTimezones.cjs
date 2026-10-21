const fs = require('fs');
const filePath = 'src/lib/timezones.js';
let content = fs.readFileSync(filePath, 'utf8');

const missingTZ = {
    'KM': 'Indian/Comoro',
    'MU': 'Indian/Mauritius',
    'SC': 'Indian/Mahe'
};

const lines = content.split('\n');
const insertIndex = lines.findIndex(l => l.includes('};'));
if (insertIndex > -1) {
    for (const [code, tz] of Object.entries(missingTZ)) {
        if (!content.includes(`'${code}':`)) {
            lines.splice(insertIndex, 0, `    '${code}': '${tz}',`);
        }
    }
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Added countries to timezones.js');
} else {
    console.log('Could not find insert point.');
}
