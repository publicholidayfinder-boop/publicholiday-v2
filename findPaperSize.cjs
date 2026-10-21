const fs = require('fs');
const content = fs.readFileSync('src/components/calendar/CalendarSidebar.jsx', 'utf-8');
const lines = content.split('\n');
// Find the label that says Paper Size in the JSX
lines.forEach((l, i) => {
    if (l.includes('Paper') || l.includes('paper') || l.includes('A4') || l.includes('Letter')) {
        console.log(i + ': ' + l.trim());
    }
});
