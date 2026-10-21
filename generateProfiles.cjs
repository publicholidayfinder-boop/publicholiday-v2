const fs = require('fs');

const missingCodes = ['AX', 'EH', 'FO', 'GG', 'GI', 'IC', 'IM', 'JE', 'RE', 'SH', 'SJ', 'YT'];
const countriesRaw = fs.readFileSync('public/data/countries.json', 'utf-8');
const countriesList = JSON.parse(countriesRaw);

for (const code of missingCodes) {
    const country = countriesList.find(c => c.id === code);
    if (!country) {
        console.error("Could not find country in countries.json:", code);
        continue;
    }

    const profile = {
        id: country.id,
        name: country.name,
        slug: country.slug,
        flag: country.flag,
        description: `In ${country.name}, public holidays are celebrated throughout the year. These include statutory national holidays, regional observances, and important cultural or religious festivals where businesses and schools may be closed.`,
        sections: [
            {
                title: `About ${country.name} Public Holidays`,
                content: `${country.name} observes several statutory and public holidays. Depending on the specific holiday and local regulations, government offices, banks, and many private businesses may close. Some holidays are celebrated on fixed dates, while others are movable and depend on lunar or religious calendars.`
            }
        ],
        faqs: [
            {
                question: `How many public holidays does ${country.name} have?`,
                answer: `The exact number of public holidays in ${country.name} can vary from year to year, depending on how movable holidays and weekend substitutions fall on the calendar.`
            }
        ]
    };

    fs.writeFileSync(`public/data/countries/${code}.json`, JSON.stringify(profile, null, 2));
    console.log(`Created profile for ${code}.`);
}
