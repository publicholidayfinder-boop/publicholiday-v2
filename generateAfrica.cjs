const fs = require('fs');
const path = require('path');
const Holidays = require('date-holidays');

const hd = new Holidays();

const missingAfrica = {
  'BI': 'Burundi',
  'KM': 'Comoros',
  'DJ': 'Djibouti',
  'ER': 'Eritrea',
  'ET': 'Ethiopia',
  'KE': 'Kenya',
  'MU': 'Mauritius',
  'RW': 'Rwanda',
  'SC': 'Seychelles',
  'SO': 'Somalia',
  'TZ': 'Tanzania',
  'UG': 'Uganda'
};

const baseDir = path.join(__dirname, 'public', 'data');
const holidaysDir = path.join(baseDir, 'holidays');
const countriesDir = path.join(baseDir, 'countries');
const countriesJsonPath = path.join(baseDir, 'countries.json');

// 2. Generate Country Pages layout (Using EE.json as base structure template)
const templateRaw = fs.readFileSync(path.join(countriesDir, 'EE.json'), 'utf8');
const template = JSON.parse(templateRaw);

for (const [code, name] of Object.entries(missingAfrica)) {
  const newProfile = JSON.parse(JSON.stringify(template)); // Deep copy
  newProfile.id = code;
  newProfile.name = name;
  newProfile.description = { en: `In ${name}, public holidays commemorate important events in the country's history as well as religious celebrations that are significant to the population.` };
  
  if (newProfile.sections[0]) {
    newProfile.sections[0].title = `About ${name}`;
    newProfile.sections[0].content = `The holiday calendar in ${name} features a mix of national, cultural, and religious holidays.`;
  }
  
  if (newProfile.sections[1]) {
    newProfile.sections[1].title = `How Public Holidays Are Observed in ${name}`;
    newProfile.sections[1].content = `On most public holidays in ${name}, government offices, schools, and banks are closed. Many private businesses also close or operate on reduced hours.`;
  }

  if (newProfile.sections[2]) {
    newProfile.sections[2].title = `Frequently Asked Questions`;
    if (newProfile.sections[2].items) {
      newProfile.sections[2].items.forEach(item => {
        item.q = item.q.replace(/Estonia/g, name);
        item.a = item.a.replace(/Estonia/g, name);
      });
    }
  }
  
  fs.writeFileSync(path.join(countriesDir, `${code}.json`), JSON.stringify(newProfile, null, 2));
  console.log(`Generated country layout for ${name} (${code})`);
}

// 3. Update public/data/countries.json
const countriesList = JSON.parse(fs.readFileSync(countriesJsonPath, 'utf8'));
const currentIds = new Set(countriesList.map(c => c.id));
let added = 0;

for (const [code, name] of Object.entries(missingAfrica)) {
  if (!currentIds.has(code)) {
    countriesList.push({ id: code, name: name });
    added++;
  }
}

if (added > 0) {
  // Sort alphabetically by name
  countriesList.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(countriesJsonPath, JSON.stringify(countriesList, null, 2));
  console.log(`Added ${added} new countries to countries.json`);
} else {
  console.log(`countries.json already contains the countries.`);
}

console.log('Done generating all data for missing African countries.');
