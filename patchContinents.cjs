const fs = require('fs');

const path = './src/lib/continents.js';
let content = fs.readFileSync(path, 'utf-8');

const codes = ['AI', 'AW', 'BM', 'BQ', 'KY', 'CW', 'GF', 'GL', 'GP', 'MQ', 'MS', 'PR', 'BL', 'MF', 'PM', 'SX', 'TC', 'VI', 'VG'];

for (const code of codes) {
    if (!content.includes("'" + code + "':")) {
        // Find the Americas block and inject it
        content = content.replace(/'US': 'Americas',/, "'US': 'Americas',\n    '" + code + "': 'Americas',");
    }
}

fs.writeFileSync(path, content);
console.log('continents.js updated.');
