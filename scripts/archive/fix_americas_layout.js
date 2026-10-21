import fs from 'fs';
import path from 'path';

const countriesDir = path.join(import.meta.dirname, '..', 'public', 'data', 'countries');

// List of North American countries
const naCountries = [
    "US", "CA", "MX", "GT", "BZ", "HN", "SV", "NI", "CR", "PA", "CU", "JM", "HT", "DO", "TT", "BB", "LC", "VC", "GD", "AG", "DM", "KN", "BS"
];

function fixLayout() {
    naCountries.forEach(countryId => {
        const filePath = path.join(countriesDir, `${countryId}.json`);
        if (fs.existsSync(filePath)) {
            const countryData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const countryName = countryData.name;

            countryData.sections = [
                {
                    title: "Important Notice",
                    content: `Public holiday dates and observance rules can change, especially when holidays fall on weekends. Always confirm critical dates with official ${countryName} government sources when planning travel, payroll, or business operations.`
                },
                {
                    title: `How ${countryName} Public Holidays Are Observed`,
                    content: `On most public and bank holidays:\n\nBanks and government offices are closed.\nSchools are closed.\nSome businesses operate reduced hours.\nPublic transport and retail services may run modified schedules.\nPrivate businesses are not legally required to close but often adjust operating hours.`
                },
                {
                    title: `Why ${countryName} Public Holidays Matter`,
                    content: `Understanding ${countryName} public holidays helps with:\n\nBusiness and payroll planning.\nSchool and academic scheduling.\nTravel and accommodation planning.\nAvoiding service disruptions.\nBoth residents and visitors benefit from knowing when closures and peak travel periods are likely.`
                },
                {
                    title: "Frequently Asked Questions",
                    items: [
                        {
                            q: `Are ${countryName} public holidays the same across all regions?`,
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
            ];

            fs.writeFileSync(filePath, JSON.stringify(countryData, null, 2), 'utf-8');
            console.log(`✅ Updated layout for ${countryName} (${countryId})`);
        } else {
            console.warn(`⚠️ File not found for ${countryId}`);
        }
    });

    console.log('Finished updating North American country layouts.');
}

fixLayout();
