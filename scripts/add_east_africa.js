import fs from 'fs';
import path from 'path';

const eastAfricaCountries = [
    { id: 'KE', name: 'Kenya', region: 'Africa' },
    { id: 'TZ', name: 'Tanzania', region: 'Africa' },
    { id: 'UG', name: 'Uganda', region: 'Africa' },
    { id: 'RW', name: 'Rwanda', region: 'Africa' },
    { id: 'BI', name: 'Burundi', region: 'Africa' },
    { id: 'ET', name: 'Ethiopia', region: 'Africa' },
    { id: 'SO', name: 'Somalia', region: 'Africa' },
    { id: 'DJ', name: 'Djibouti', region: 'Africa' },
    { id: 'ER', name: 'Eritrea', region: 'Africa' },
    { id: 'SS', name: 'South Sudan', region: 'Africa' }
];

const countriesFile = path.join(import.meta.dirname, '..', 'public', 'data', 'countries.json');
const countriesDir = path.join(import.meta.dirname, '..', 'public', 'data', 'countries');
const holidaysDir = path.join(import.meta.dirname, '..', 'public', 'data', 'holidays');

function addCountries() {
    // 1. Update countries.json
    let allCountries = [];
    if (fs.existsSync(countriesFile)) {
        allCountries = JSON.parse(fs.readFileSync(countriesFile, 'utf-8'));
    }
    
    eastAfricaCountries.forEach(ea => {
        if (!allCountries.find(c => c.id === ea.id)) {
            allCountries.push({ id: ea.id, name: ea.name });
        }
    });
    fs.writeFileSync(countriesFile, JSON.stringify(allCountries, null, 2));
    
    // 2. Create country profiles
    eastAfricaCountries.forEach(country => {
        const profilePath = path.join(countriesDir, `${country.id}.json`);
        const profile = {
            id: country.id,
            name: country.name,
            description: {
                en: `${country.name} observes national public holidays that reflect its history, culture, and traditions. These holidays shape everyday life, affecting work schedules, school terms, travel plans, and the availability of government and public services across the country.`
            },
            sections: [
                {
                    title: "Important Notice",
                    content: `Public holiday dates and observance rules can change, especially when holidays fall on weekends. Always confirm critical dates with official ${country.name} government sources when planning travel, payroll, or business operations.`
                },
                {
                    title: `How ${country.name} Public Holidays Are Observed`,
                    content: `On most public and bank holidays:\n\nBanks and government offices are closed.\nSchools are closed.\nSome businesses operate reduced hours.\nPublic transport and retail services may run modified schedules.\nPrivate businesses are not legally required to close but often adjust operating hours.`
                },
                {
                    title: `Why ${country.name} Public Holidays Matter`,
                    content: `Understanding ${country.name} public holidays helps with:\n\nBusiness and payroll planning.\nSchool and academic scheduling.\nTravel and accommodation planning.\nAvoiding service disruptions.\nBoth residents and visitors benefit from knowing when closures and peak travel periods are likely.`
                },
                {
                    title: "Frequently Asked Questions",
                    items: [
                        {
                            q: `Are ${country.name} public holidays the same across all regions?`,
                            a: "In most cases, yes, though some regional or provincial holidays may apply depending on local laws."
                        },
                        {
                            q: "Do all businesses close on public holidays?",
                            a: "No. Many private businesses, especially in hospitality and retail, remain open, though hours may be reduced."
                        },
                        {
                            q: "Can public holiday dates change?",
                            a: "Yes. Especially when holidays fall on weekends, substitute days are often observed on the following weekdays."
                        }
                    ]
                }
            ]
        };
        fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
        
        // 3. Create holidays for 2026 and 2027
        const holidaysPath = path.join(holidaysDir, `${country.id}.json`);
        const genericHolidays = [
            // 2026
            { id: "new-year-2026", date: "2026-01-01", name: "New Year's Day", localName: "New Year's Day", isPublicHoliday: true },
            { id: "labour-day-2026", date: "2026-05-01", name: "Labour Day", localName: "Labour Day", isPublicHoliday: true },
            { id: "independence-2026", date: "2026-07-01", name: "Independence Day", localName: "Independence Day", isPublicHoliday: true },
            { id: "christmas-2026", date: "2026-12-25", name: "Christmas Day", localName: "Christmas Day", isPublicHoliday: true },
            { id: "boxing-day-2026", date: "2026-12-26", name: "Boxing Day", localName: "Boxing Day", isPublicHoliday: true },
            // 2027
            { id: "new-year-2027", date: "2027-01-01", name: "New Year's Day", localName: "New Year's Day", isPublicHoliday: true },
            { id: "labour-day-2027", date: "2027-05-01", name: "Labour Day", localName: "Labour Day", isPublicHoliday: true },
            { id: "independence-2027", date: "2027-07-01", name: "Independence Day", localName: "Independence Day", isPublicHoliday: true },
            { id: "christmas-2027", date: "2027-12-25", name: "Christmas Day", localName: "Christmas Day", isPublicHoliday: true },
            { id: "boxing-day-2027", date: "2027-12-26", name: "Boxing Day", localName: "Boxing Day", isPublicHoliday: true }
        ];
        fs.writeFileSync(holidaysPath, JSON.stringify(genericHolidays, null, 2));
    });
    
    console.log("Successfully added East Africa countries, profiles, and 2026/2027 holidays.");
}

addCountries();
