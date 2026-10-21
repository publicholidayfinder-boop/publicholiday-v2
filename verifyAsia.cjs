const fs = require('fs');
const content = fs.readFileSync('./src/lib/continents.js', 'utf-8');
['AE', 'SA', 'BH', 'BN', 'IR', 'IL'].forEach(c => {
    const found = content.includes("'" + c + "': 'Asia'") || content.includes('"' + c + '": "Asia"');
    console.log(c, found ? 'OK' : 'MISSING');
});
