const fs = require('fs');
const Holidays = require('date-holidays');

const codes = ['AE', 'BH', 'BN', 'IL', 'IR', 'SA'];
const hd = new Holidays();

// Override some native names with English if needed
const englishNames = {
  'AE': 'United Arab Emirates',
  'BH': 'Bahrain',
  'BN': 'Brunei Darussalam',
  'IL': 'Israel',
  'IR': 'Iran',
  'SA': 'Saudi Arabia'
};

// 1. Generate Holiday Data
for (const code of codes) {
    const countryName = englishNames[code];
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
                content: countryName + ' observes a unique calendar of public holidays that reflect its culture, history, and traditions. Some holidays are based on the lunar calendar, meaning their Gregorian dates change each year.'
            },
            {
                title: 'How Public Holidays Are Observed',
                content: 'On public holidays in ' + countryName + ', schools, government offices, and most private businesses are typically closed. Public transport may operate on a reduced schedule. Essential services remain operational.'
            },
            {
                title: 'Frequently Asked Questions',
                items: [
                    {
                        q: { en: 'Are shops open on public holidays in ' + countryName + '?' },
                        a: { en: 'Many large retail stores and malls may remain open, sometimes with altered hours, while smaller independent shops and local businesses usually close. It is advisable to check ahead.' }
                    },
                    {
                        q: { en: 'How are weekends treated for holidays in ' + countryName + '?' },
                        a: { en: 'If a fixed-date public holiday falls on a weekend, ' + countryName + ' may provide a substitute day off, though this depends on specific labor laws and government announcements.' }
                    },
                    {
                        q: { en: 'Is public transport available on holidays?' },
                        a: { en: 'Public transportation generally runs on a weekend or holiday schedule, which means reduced frequency. It is recommended to check local transit websites before traveling.' }
                    },
                    {
                        q: { en: 'Are dates for religious holidays fixed?' },
                        a: { en: 'Holidays based on the lunar calendar are subject to moon sightings and can vary by a day or two from the predicted dates on the Gregorian calendar.' }
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
        countriesList.push({ id: code, name: englishNames[code] });
    }
}
countriesList.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync('./public/data/countries.json', JSON.stringify(countriesList, null, 2));

console.log('Finished generating JSONs for ' + codes.length + ' Asian countries.');
