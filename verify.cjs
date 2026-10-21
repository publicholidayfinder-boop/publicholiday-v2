const fs = require('fs');
const countries = JSON.parse(fs.readFileSync('public/data/countries.json', 'utf8'));
console.log('Total countries in app:', countries.length);
const continents = fs.readFileSync('src/lib/continents.js', 'utf8');

let africaCount = 0;
countries.forEach(c => {
    if (continents.includes(`'${c.id}': 'Africa'`)) {
        africaCount++;
    }
});
console.log('Total Africa mapped in app:', africaCount);
