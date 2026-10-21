const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarWorkspace.jsx', 'utf-8');

const importIdx = content.indexOf('import React');
if (importIdx > 0) {
    content = content.slice(importIdx);
}

const lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('MonthTitle') || l.includes('monthTitle') || l.includes('header') && l.includes('flex')) {
        console.log(i + ': ' + l.trim());
    }
});
