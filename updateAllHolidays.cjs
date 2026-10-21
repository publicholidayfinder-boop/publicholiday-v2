const fs = require('fs');
const Holidays = require('date-holidays');

const countriesRaw = fs.readFileSync('./public/data/countries.json', 'utf-8');
const countriesList = JSON.parse(countriesRaw);
const codes = countriesList.map(c => c.id);

const hd = new Holidays();

let totalHolidays = 0;
let updatedCount = 0;

console.log(`Starting generation for ${codes.length} countries (2021-2030) in English...`);

for (const code of codes) {
    hd.init(code);
    hd.setLanguages(['en']);
    
    let allHolidays = [];
    for (let year = 2021; year <= 2030; year++) {
        let holidays = hd.getHolidays(year);
        if (holidays && holidays.length > 0) {
            holidays = holidays.map(h => ({
                id: Buffer.from(code + h.name + h.date).toString('base64'),
                countryCode: code,
                slug: h.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                name: h.name,
                date: h.date.split(' ')[0],
                year: year,
                type: h.type || 'National',
                isPublicHoliday: h.type === 'public',
                description: h.name
            }));
            allHolidays = allHolidays.concat(holidays);
        }
    }
    
    fs.writeFileSync('./public/data/holidays/' + code + '.json', JSON.stringify(allHolidays, null, 2));
    totalHolidays += allHolidays.length;
    updatedCount++;
    
    if (updatedCount % 20 === 0 || updatedCount === codes.length) {
        console.log(`Progress: ${updatedCount}/${codes.length} countries completed...`);
    }
}

console.log(`\nFinished! Generated a total of ${totalHolidays} holidays across ${codes.length} countries for years 2021-2030.`);
