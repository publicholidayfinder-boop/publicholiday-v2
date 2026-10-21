const fs = require('fs');
const continents = fs.readFileSync('./src/lib/continents.js', 'utf-8');
const timezones = fs.readFileSync('./src/lib/timezones.js', 'utf-8');
const codes = ['FJ', 'NZ', 'TO', 'VU', 'AS', 'CK', 'GU', 'NC', 'NF', 'PF', 'WF', 'CC', 'CX'];
codes.forEach(c => {
    const inCont = continents.includes("'" + c + "': 'Oceania'");
    const inTz = timezones.includes("'" + c + "':");
    const inCountries = JSON.parse(fs.readFileSync('./public/data/countries.json','utf-8')).some(x => x.id === c);
    console.log(c, 'Continent:', inCont ? 'OK' : 'MISSING', '| Timezone:', inTz ? 'OK' : 'MISSING', '| countries.json:', inCountries ? 'OK' : 'MISSING');
});
