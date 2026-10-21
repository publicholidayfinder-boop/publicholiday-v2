const fs = require('fs');

const path = './src/lib/continents.js';
let content = fs.readFileSync(path, 'utf-8');

const mapping = {
  'BH': 'Asia',
  'BN': 'Asia',
  'IR': 'Asia',
  'IL': 'Asia'
};

for (const [code, continent] of Object.entries(mapping)) {
    if (!content.includes("'" + code + "':")) {
        content = content.replace(/"'AE': 'Asia',/, "'AE': 'Asia',\n    '" + code + "': '" + continent + "',");
    }
}

fs.writeFileSync(path, content);
console.log('continents.js updated with BH, BN, IR, IL.');
