const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'data', 'countries');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let updated = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.sections) continue;
  
  const name = data.name || file.replace('.json', '');

  const newFaqItems = [
    {
      "q": { "en": `Are all public holidays observed nationwide in ${name}?` },
      "a": { "en": `While many holidays are national, some observances may be limited to specific regions, states, or territories.` }
    },
    {
      "q": { "en": `Do businesses and stores close on public holidays in ${name}?` },
      "a": { "en": `Generally yes. Government offices, banks, and schools are closed. Essential services and some retail sectors may remain open or operate on reduced hours.` }
    },
    {
      "q": { "en": `What happens if a public holiday falls on a weekend in ${name}?` },
      "a": { "en": `In many cases, if a national holiday falls on a Saturday or Sunday, the observance is moved to the following Monday, though this depends on specific local laws and the holiday in question.` }
    },
    {
      "q": { "en": `Are public transport services affected by holidays in ${name}?` },
      "a": { "en": `Yes, public transportation often runs on a reduced Sunday or holiday schedule during national public holidays.` }
    },
    {
      "q": { "en": `Are employees entitled to paid time off on public holidays in ${name}?` },
      "a": { "en": `Most full-time employees are legally entitled to a paid day off on national public holidays. Those who are required to work are typically eligible for premium pay or a substitute day off.` }
    }
  ];

  // Find the FAQ section
  let faqSection = data.sections.find(s => {
    const t = typeof s.title === 'string' ? s.title : (s.title && s.title.en ? s.title.en : '');
    return t.includes('Frequently Asked Questions') || t.includes('FAQ');
  });

  if (faqSection) {
    // If it's the old structure, make sure it has the new items
    faqSection.items = newFaqItems;
  } else {
    // Append it
    data.sections.push({
      title: { en: "Frequently Asked Questions" },
      items: newFaqItems
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  updated++;
}

console.log(`Updated FAQs for ${updated} countries.`);
