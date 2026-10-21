const countries = ['CG', 'CD', 'GA'];
const years = [2026, 2027, 2028];

async function printHolidays() {
  for (const country of countries) {
    for (const year of years) {
      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
        if (res.ok) {
          const data = await res.json();
          console.log(`=== ${country} ${year} ===`);
          console.log(JSON.stringify(data, null, 2));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}

printHolidays();
