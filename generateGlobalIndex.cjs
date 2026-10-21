const fs = require('fs');

const countriesRaw = fs.readFileSync('./public/data/countries.json', 'utf-8');
const countriesList = JSON.parse(countriesRaw);
const codes = countriesList.map(c => c.id);

const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

for (const year of years) {
    const globalData = {};
    
    for (const code of codes) {
        const filePath = `./public/data/holidays/${code}.json`;
        if (fs.existsSync(filePath)) {
            const holidays = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            // Only include true public holidays to avoid cluttering the global view with minor observances
            const yearHolidays = holidays.filter(h => h.year === year && h.isPublicHoliday);
            
            for (const h of yearHolidays) {
                if (!globalData[h.date]) {
                    globalData[h.date] = [];
                }
                globalData[h.date].push({
                    countryCode: code,
                    name: h.name
                });
            }
        }
    }
    
    fs.writeFileSync(`./public/data/global-${year}.json`, JSON.stringify(globalData));
}

console.log('Global holiday indexes generated for years 2024-2030.');
