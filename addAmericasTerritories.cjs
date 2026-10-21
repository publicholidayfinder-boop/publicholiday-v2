const fs = require('fs');
const Holidays = require('date-holidays');

const codes = ['AI', 'AW', 'BM', 'BQ', 'KY', 'CW', 'GF', 'GL', 'GP', 'MQ', 'MS', 'PR', 'BL', 'MF', 'PM', 'SX', 'TC', 'VI', 'VG'];
const hd = new Holidays();
const allCountries = hd.getCountries();

// 1. Generate Holiday Data
for (const code of codes) {
    const countryName = allCountries[code];
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

    // 2. Generate Country Metadata
    const meta = {
        id: code,
        name: countryName,
        description: {
            en: 'Discover public holidays, national days, and regional observances in ' + countryName + '. Plan your travels and schedule around the official holiday calendar.'
        },
        sections: [
            {
                title: 'About ' + countryName,
                content: countryName + ' has a unique calendar of public holidays that reflect its culture, history, and traditions. The local observances often include both national and regional celebrations.'
            },
            {
                title: 'How Public Holidays Are Observed',
                content: 'On public holidays in ' + countryName + ', schools, government offices, and many private businesses are typically closed. Public transport may operate on a reduced schedule. Essential services remain operational.'
            },
            {
                title: 'Frequently Asked Questions',
                items: [
                    {
                        q: { en: 'Are shops open on public holidays in ' + countryName + '?' },
                        a: { en: 'Many large retail stores and supermarkets may operate on reduced hours, while smaller independent shops and local businesses usually close. It is advisable to check ahead.' }
                    },
                    {
                        q: { en: 'How are weekends treated for holidays in ' + countryName + '?' },
                        a: { en: 'If a fixed-date public holiday falls on a weekend, ' + countryName + ' often provides a substitute day off on the following Monday, though this depends on the specific holiday laws.' }
                    },
                    {
                        q: { en: 'Is public transport available on holidays?' },
                        a: { en: 'Public transportation generally runs on a Sunday or holiday schedule, which means reduced frequency. It is recommended to check local transit websites before traveling.' }
                    },
                    {
                        q: { en: 'What is the most significant holiday in ' + countryName + '?' },
                        a: { en: 'Major holidays usually include New Year\'s Day, religious observances like Christmas or Easter, and significant local national or territory days.' }
                    },
                    {
                        q: { en: 'Do holidays affect banking hours?' },
                        a: { en: 'Yes, banks are closed on all official public holidays. Online banking remains available, but physical branches will not be open.' }
                    }
                ]
            }
        ]
    };
    fs.writeFileSync('./public/data/countries/' + code + '.json', JSON.stringify(meta, null, 2));
}

// 3. Update countries.json
const countriesList = JSON.parse(fs.readFileSync('./public/data/countries.json', 'utf-8'));
for (const code of codes) {
    if (!countriesList.find(c => c.id === code)) {
        countriesList.push({ id: code, name: allCountries[code] });
    }
}
countriesList.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync('./public/data/countries.json', JSON.stringify(countriesList, null, 2));

console.log('Finished generating JSONs for ' + codes.length + ' territories.');
