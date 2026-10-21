import fs from 'fs';

const countries = ['CM', 'CF', 'TD', 'CG', 'CD', 'GQ', 'GA', 'ST'];
const years = [2026, 2027, 2028];

async function checkApi() {
  for (const country of countries) {
    console.log(`Checking ${country}...`);
    for (const year of years) {
      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
        if (res.ok) {
          const data = await res.json();
          console.log(`  ${year}: found ${data.length} holidays`);
        } else {
          console.log(`  ${year}: failed (status ${res.status})`);
        }
      } catch (e) {
        console.log(`  ${year}: error ${e.message}`);
      }
    }
  }
}

checkApi();
