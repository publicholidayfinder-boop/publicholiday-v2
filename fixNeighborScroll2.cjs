const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// Line 886 = desktop NeighboringCountries Link `to` prop (0-indexed)
// Line 933 = mobile MobileNeighboringCountries Link `to` prop (0-indexed)
// Insert onClick after each `to` line

const scrollLine = '                        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: \'instant\' })}';
const scrollLineMobile = '                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: \'instant\' })}';

// Insert after line 886 (desktop), and 933+1=934 (mobile, shifted +1 after desktop insert)
lines.splice(887, 0, scrollLine);
lines.splice(935, 0, scrollLineMobile);  // 933 + 1 (from the splice above) + 1 = 935

fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Done. scrollTo added to both desktop and mobile neighbor links.');
