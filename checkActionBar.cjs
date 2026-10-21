const fs = require('fs');
const lines = fs.readFileSync('src/components/calendar/CalendarActionBar.jsx', 'utf-8').split('\n');
const selectIdx = lines.findIndex(l => l.includes('<select'));
console.log(lines.slice(selectIdx - 5, selectIdx + 12).map((l, i) => (selectIdx-5+i) + ': ' + l).join('\n'));
