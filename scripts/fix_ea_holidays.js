import fs from 'fs';
import path from 'path';

const eastAfricaCountries = ['KE', 'TZ', 'UG', 'RW', 'BI', 'ET', 'SO', 'DJ', 'ER', 'SS'];
const holidaysDir = path.join(import.meta.dirname, '..', 'public', 'data', 'holidays');

eastAfricaCountries.forEach(countryCode => {
    const filePath = path.join(holidaysDir, `${countryCode}.json`);
    if (fs.existsSync(filePath)) {
        let holidays = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        let modified = false;
        
        holidays = holidays.map(h => {
            if (!h.year && h.date) {
                h.year = parseInt(h.date.split('-')[0], 10);
                modified = true;
            }
            if (!h.type) {
                h.type = "National";
                modified = true;
            }
            return h;
        });

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(holidays, null, 2));
            console.log(`Fixed holidays for ${countryCode}`);
        }
    }
});

console.log('All done.');
