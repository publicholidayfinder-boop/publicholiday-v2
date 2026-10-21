import fs from 'fs';
import path from 'path';

const countries = ['CM', 'CF', 'TD', 'CG', 'CD', 'GQ', 'GA', 'ST'];
const publicDataPath = 'public/data';

function check() {
  console.log('Running added data verification checks...');
  
  // 1. Check countries.json lists these countries
  const countriesList = JSON.parse(fs.readFileSync(path.join(publicDataPath, 'countries.json'), 'utf8'));
  countries.forEach(code => {
    const found = countriesList.find(c => c.id === code);
    if (!found) {
      console.error(`❌ Error: Country ${code} not found in countries.json`);
    } else {
      console.log(`✅ Country ${code} found in countries.json: ${found.name}`);
    }
  });

  // 2. Check each country profile file and holiday calendar file
  countries.forEach(code => {
    const profilePath = path.join(publicDataPath, 'countries', `${code}.json`);
    const holidaysPath = path.join(publicDataPath, 'holidays', `${code}.json`);

    if (!fs.existsSync(profilePath)) {
      console.error(`❌ Error: Profile file for ${code} does not exist at ${profilePath}`);
      return;
    }
    if (!fs.existsSync(holidaysPath)) {
      console.error(`❌ Error: Holidays file for ${code} does not exist at ${holidaysPath}`);
      return;
    }

    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    const holidays = JSON.parse(fs.readFileSync(holidaysPath, 'utf8'));

    console.log(`✅ Profile for ${code} validated (${profile.name}).`);
    
    // Check holiday counts for each year
    const count2026 = holidays.filter(h => h.year === 2026).length;
    const count2027 = holidays.filter(h => h.year === 2027).length;
    const count2028 = holidays.filter(h => h.year === 2028).length;

    console.log(`   - Holidays: 2026 (${count2026}), 2027 (${count2027}), 2028 (${count2028})`);
    
    if (count2026 === 0 || count2027 === 0 || count2028 === 0) {
      console.error(`❌ Error: Missing holidays for a year in ${code}.json`);
    }
  });
  
  console.log('Verification checks finished.');
}

check();
