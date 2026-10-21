const fs = require('fs');
const lines = fs.readFileSync('src/components/calendar/CalendarActionBar.jsx', 'utf-8').split('\n');

const idx = lines.findIndex(l => l.includes('<span className="text-[10px] text-slate-500 font-bold'));

// Remove the span lines from inside the select
const spanLines = lines.splice(idx, 3);

// Insert them BEFORE the select tag
const selectIdx = lines.findIndex(l => l.includes('<select'));
lines.splice(selectIdx, 0, ...spanLines);

fs.writeFileSync('src/components/calendar/CalendarActionBar.jsx', lines.join('\n'), 'utf-8');
console.log('Fixed ICS span location.');
