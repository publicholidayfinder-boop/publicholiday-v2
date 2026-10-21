const fs = require('fs');
const lines = fs.readFileSync('src/components/calendar/CalendarActionBar.jsx', 'utf-8').split('\n');

const idx = lines.findIndex(l => l.includes('<span className="text-[10px] text-slate-500 font-bold'));
if (idx > -1) {
    console.log('Found mistake at line:', idx);
    console.log(lines.slice(idx - 5, idx + 8).map((l, i) => (idx-5+i) + ': ' + l).join('\n'));
}
