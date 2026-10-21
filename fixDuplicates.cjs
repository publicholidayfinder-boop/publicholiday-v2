const fs = require('fs');
const Holidays = require('date-holidays');

const countriesRaw = fs.readFileSync('./public/data/countries.json', 'utf-8');
const countriesList = JSON.parse(countriesRaw);
const codes = countriesList.map(c => c.id);

const hd = new Holidays();

let totalHolidays = 0;
let updatedCount = 0;

console.log(`Starting generation for ${codes.length} countries (2021-2030) in English with deduplication...`);

const typePriority = {
    'public': 4,
    'bank': 3,
    'observance': 2,
    'optional': 1,
    'National': 0
};

for (const code of codes) {
    hd.init(code);
    hd.setLanguages(['en']);
    
    let allHolidays = [];
    for (let year = 2021; year <= 2030; year++) {
        let holidays = hd.getHolidays(year);
        if (holidays && holidays.length > 0) {
            
            // Deduplicate by name and date
            let uniqueHolidays = new Map();
            
            for (let h of holidays) {
                const dateStr = h.date.split(' ')[0];
                const key = `${dateStr}-${h.name}`;
                const currentType = h.type || 'National';
                
                if (!uniqueHolidays.has(key)) {
                    uniqueHolidays.set(key, h);
                } else {
                    const existing = uniqueHolidays.get(key);
                    const existingType = existing.type || 'National';
                    
                    if ((typePriority[currentType] || 0) > (typePriority[existingType] || 0)) {
                        uniqueHolidays.set(key, h);
                    }
                }
            }
            
            holidays = Array.from(uniqueHolidays.values()).map(h => ({
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
