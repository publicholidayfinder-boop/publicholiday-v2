const fs = require('fs');
const lines = fs.readFileSync('src/components/calendar/CalendarActionBar.jsx', 'utf-8').split('\n');

// Find the ICS scope selector
const idx = lines.findIndex(l => l.includes('title="ICS export scope"'));

const scopeLabel = [
    '                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1.5 hidden sm:inline">',
    '                            Export:',
    '                        </span>'
];

lines.splice(idx - 1, 0, ...scopeLabel);

fs.writeFileSync('src/components/calendar/CalendarActionBar.jsx', lines.join('\n'), 'utf-8');
console.log('Added label to ICS scope selector.');
