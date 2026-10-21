const fs = require('fs');
const lines = fs.readFileSync('src/components/calendar/CalendarWorkspace.jsx', 'utf-8').split('\n');
console.log('First 5 lines:', lines.slice(0, 5).join('\n'));
const navIdx = lines.findIndex(l => l.includes('Previous Month'));
console.log('\nNav at line:', navIdx);
console.log(lines.slice(navIdx - 3, navIdx + 5).map((l, i) => (navIdx-3+i) + ': ' + l).join('\n'));
