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

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate Holiday Data (2021-2030) with required fields
for (const [code, name] of Object.entries(missingAfrica)) {
  hd.init(code);
  const years = [];
  for (let y = 2021; y <= 2030; y++) {
    const hols = hd.getHolidays(y);
    hols.forEach(h => {
      let mappedType = h.type === 'public' ? 'National' : 'Observance';
      const lowercaseName = h.name.toLowerCase();
      if (lowercaseName.includes('eid') || lowercaseName.includes('prophet') || lowercaseName.includes('islamic')) {
        mappedType = 'Islamic';
      } else if (lowercaseName.includes('christmas') || lowercaseName.includes('easter') || lowercaseName.includes('friday') || lowercaseName.includes('ascension')) {
        mappedType = 'Christian';
      }
      
      years.push({
        id: Buffer.from(h.name + h.date).toString('base64').substring(0, 8),
        countryCode: code,
        slug: slugify(h.name),
        name: h.name,
        date: h.date.substring(0, 10),
        year: y,
        type: mappedType,
        isPublicHoliday: h.type === 'public',
        description: h.name
      });
    });
  }
  
  fs.writeFileSync(path.join(holidaysDir, `${code}.json`), JSON.stringify(years, null, 2));
  console.log(`Regenerated correct holiday data for ${name} (${code})`);
}
