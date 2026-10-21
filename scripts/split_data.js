import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/holidays.json');
const publicDataPath = path.join(__dirname, '../public/data');
const publicCountriesPath = path.join(publicDataPath, 'countries');
const publicHolidaysPath = path.join(publicDataPath, 'holidays');

// Create directories if they don't exist
if (!fs.existsSync(publicDataPath)) fs.mkdirSync(publicDataPath, { recursive: true });
if (!fs.existsSync(publicCountriesPath)) fs.mkdirSync(publicCountriesPath, { recursive: true });
if (!fs.existsSync(publicHolidaysPath)) fs.mkdirSync(publicHolidaysPath, { recursive: true });

// Read the monolithic JSON
console.log('Reading holidays.json...');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 1. Create a minimal list of countries for the dropdown
console.log('Generating minimal countries.json...');
const minimalCountries = data.countries.map(c => ({
    id: c.id,
    name: c.name
}));
fs.writeFileSync(
    path.join(publicDataPath, 'countries.json'),
    JSON.stringify(minimalCountries, null, 2)
);

// 2. Save individual full country files
console.log('Generating individual country files...');
for (const country of data.countries) {
    fs.writeFileSync(
        path.join(publicCountriesPath, `${country.id}.json`),
        JSON.stringify(country, null, 2)
    );
}

// 3. Group holidays by country and save them
console.log('Generating individual holiday files...');
const holidaysByCountry = {};
for (const holiday of data.holidays) {
    if (!holidaysByCountry[holiday.countryCode]) {
        holidaysByCountry[holiday.countryCode] = [];
    }
    holidaysByCountry[holiday.countryCode].push(holiday);
}

for (const [countryCode, holidays] of Object.entries(holidaysByCountry)) {
    fs.writeFileSync(
        path.join(publicHolidaysPath, `${countryCode}.json`),
        JSON.stringify(holidays, null, 2)
    );
}

console.log('✅ Data successfully split into public/data/');
