const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// Find the Filter Toggle Bar line with the count span
const filterBarLine = lines.findIndex(l =>
    l.includes('displayedHolidays.length') && l.includes('publicOnly') && l.includes('Total')
);
console.log('Filter bar span at line:', filterBarLine);
console.log(lines.slice(filterBarLine - 2, filterBarLine + 5).map((l, i) => (filterBarLine-2+i) + ': ' + l).join('\n'));
