import fs from 'fs';
import path from 'path';

const countries = ['CG', 'CD'];
const years = [2026, 2027, 2028];

async function saveHolidays() {
  const result = {};
  for (const country of countries) {
    result[country] = {};
    for (const year of years) {
      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
        if (res.ok) {
          result[country][year] = await res.json();
        } else {
          result[country][year] = [];
        }
      } catch (e) {
        console.error(e);
        result[country][year] = [];
      }
    }
  }
  fs.writeFileSync('scratch/cg_cd_holidays.json', JSON.stringify(result, null, 2));
  console.log('Saved to scratch/cg_cd_holidays.json');
}

saveHolidays();
