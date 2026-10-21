const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarWorkspace.jsx', 'utf-8');
const importIdx = content.indexOf('import React');
content = content.slice(importIdx);
const lines = content.split('\n');
// Find the calendar header/title area
lines.forEach((l, i) => {
    if (i < 200 && (l.includes('title') || l.includes('Year') || l.includes('Month') || l.includes('month')) && l.includes('{')) {
        console.log(i + ': ' + l.trim().substring(0, 100));
    }
});
