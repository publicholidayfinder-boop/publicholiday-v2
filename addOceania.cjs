const fs = require('fs');
const Holidays = require('date-holidays');

const hd = new Holidays();

const territories = {
  'FJ': 'Fiji',
  'NZ': 'New Zealand',
  'TO': 'Tonga',
  'VU': 'Vanuatu',
  'AS': 'American Samoa',
  'CK': 'Cook Islands',
  'GU': 'Guam',
  'NC': 'New Caledonia',
  'NF': 'Norfolk Island',
  'PF': 'French Polynesia',
  'WF': 'Wallis and Futuna',
  'CC': 'Cocos (Keeling) Islands',
  'CX': 'Christmas Island'
};

// 1. Generate Holiday + Country JSON files
for (const [code, name] of Object.entries(territories)) {
    hd.init(code);
    hd.setLanguages(['en']);
    
    let allHolidays = [];
    for (let year = 2021; year <= 2030; year++) {
        let holidays = hd.getHolidays(year) || [];
        holidays = holidays.map(h => ({
            id: Buffer.from(code + h.name + h.date).toString('base64'),
            countryCode: code,
            slug: h.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-\$)/g, ''),
            name: h.name,
            date: h.date.split(' ')[0],
            year: year,
            type: h.type || 'National',
            isPublicHoliday: h.type === 'public',
            description: h.name
        }));
        allHolidays = allHolidays.concat(holidays);
    }
    fs.writeFileSync('./public/data/holidays/' + code + '.json', JSON.stringify(allHolidays, null, 2));

    const meta = {
        id: code,
        name: name,
        description: { en: 'Discover public holidays, national days, and regional observances in ' + name + '. Plan your travels and schedule around the official holiday calendar.' },
        sections: [
            {
                title: 'About ' + name,
                content: name + ' observes a unique calendar of public holidays shaped by its Pacific heritage, colonial history, and national traditions. Official public holidays are gazetted by the government and observed nationwide.'
            },
            {
                title: 'How Public Holidays Are Observed',
                content: 'On public holidays in ' + name + ', schools, government offices, and most private businesses are typically closed. Public transport may operate on a reduced schedule. Essential services remain operational.'
            },
            {
                title: 'Frequently Asked Questions',
                items: [
                    { q: { en: 'Are shops open on public holidays in ' + name + '?' }, a: { en: 'Many large retail stores and supermarkets may operate on reduced hours on public holidays, while smaller independent shops usually close. It is advisable to check ahead.' } },
                    { q: { en: 'How are weekends handled for public holidays?' }, a: { en: 'If a public holiday falls on a weekend, ' + name + ' generally observes a substitute weekday holiday, typically the following Monday, though this depends on specific legislation.' } },
                    { q: { en: 'Is public transport available on holidays?' }, a: { en: 'Public transportation usually runs on a Sunday or reduced holiday timetable. Check local transit authority websites before traveling on public holidays.' } },
                    { q: { en: 'What is the most important holiday in ' + name + '?' }, a: { en: 'Key public holidays typically include New Year\'s Day, significant national or independence days, and major religious observances like Christmas and Easter.' } },
                    { q: { en: 'Do public holidays affect banking?' }, a: { en: 'Yes, banks are closed on all gazetted public holidays. ATMs and online banking remain available, but physical branch services are suspended.' } }
                ]
            }
        ]
    };
    fs.writeFileSync('./public/data/countries/' + code + '.json', JSON.stringify(meta, null, 2));
    console.log('Generated: ' + code + ' (' + name + ') - ' + allHolidays.length + ' holidays');
}

// 2. Update countries.json
const countriesList = JSON.parse(fs.readFileSync('./public/data/countries.json', 'utf-8'));
for (const [code, name] of Object.entries(territories)) {
    if (!countriesList.find(c => c.id === code)) {
        countriesList.push({ id: code, name });
    }
}
countriesList.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync('./public/data/countries.json', JSON.stringify(countriesList, null, 2));
console.log('\nTotal countries now: ' + countriesList.length);
