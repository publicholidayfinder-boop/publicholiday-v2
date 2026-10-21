const fs = require('fs');
const Holidays = require('date-holidays');

const newCountries = [
  { id: 'AX', name: 'Åland Islands', flag: '🇦🇽' },
  { id: 'EH', name: 'Western Sahara', flag: '🇪🇭' },
  { id: 'FO', name: 'Faroe Islands', flag: '🇫🇴' },
  { id: 'GG', name: 'Guernsey', flag: '🇬🇬' },
  { id: 'GI', name: 'Gibraltar', flag: '🇬🇮' },
  { id: 'IC', name: 'Canary Islands', flag: '🇮🇨' },
  { id: 'IM', name: 'Isle of Man', flag: '🇮🇲' },
  { id: 'JE', name: 'Jersey', flag: '🇯🇪' },
  { id: 'RE', name: 'Réunion', flag: '🇷🇪' },
  { id: 'SH', name: 'Saint Helena', flag: '🇸🇭' },
  { id: 'SJ', name: 'Svalbard and Jan Mayen', flag: '🇸🇯' },
  { id: 'YT', name: 'Mayotte', flag: '🇾🇹' }
];

// 1. Update public/data/countries.json
const countriesPath = './public/data/countries.json';
const existingCountries = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));
const existingIds = new Set(existingCountries.map(c => c.id));

for (const nc of newCountries) {
    if (!existingIds.has(nc.id)) {
        existingCountries.push({
            id: nc.id,
            name: nc.name,
            slug: nc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            flag: nc.flag,
            description: `Public holidays and observances in ${nc.name}.`,
            faqs: []
        });
    }
}
// Sort by name
existingCountries.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(countriesPath, JSON.stringify(existingCountries, null, 2));
console.log('Added 12 new countries to countries.json.');

// 2. Generate Holiday Data
const hd = new Holidays();
for (const nc of newCountries) {
    hd.init(nc.id);
    hd.setLanguages(['en']);
    
    let allHolidays = [];
    for (let year = 2021; year <= 2030; year++) {
        let holidays = hd.getHolidays(year);
        if (holidays && holidays.length > 0) {
            holidays = holidays.map(h => ({
                id: Buffer.from(nc.id + h.name + h.date).toString('base64'),
                countryCode: nc.id,
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
    fs.writeFileSync('./public/data/holidays/' + nc.id + '.json', JSON.stringify(allHolidays, null, 2));
    console.log(`Generated holidays for ${nc.name} (${allHolidays.length} holidays)`);
}

// deduplicate logic (re-run fixDateDuplicates on just these files to be safe)
for (const nc of newCountries) {
    const filePath = './public/data/holidays/' + nc.id + '.json';
    const holidays = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // 1st Dedupe: exact same day, pick highest priority
    const typePriority = { public: 3, bank: 2, optional: 1, observance: 0 };
    const dateMap = new Map();
    for (const h of holidays) {
        const existing = dateMap.get(h.date);
        const currentPrio = typePriority[h.type] || 0;
        const existingPrio = existing ? (typePriority[existing.type] || 0) : -1;
        
        if (!existing) {
            dateMap.set(h.date, h);
        } else {
            // merge names if different
            if (existing.name !== h.name) {
                h.name = existing.name + ' / ' + h.name;
            }
            if (currentPrio > existingPrio) {
                dateMap.set(h.date, h);
            } else if (currentPrio === existingPrio) {
                existing.name = h.name;
            }
        }
    }
    
    const finalHolidays = Array.from(dateMap.values());
    fs.writeFileSync(filePath, JSON.stringify(finalHolidays, null, 2));
}

