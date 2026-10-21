const fs = require('fs');
const lines = fs.readFileSync('src/components/calendar/CalendarWorkspace.jsx', 'utf-8').split('\n');
// Find the calendar header div containing the title
lines.forEach((l, i) => {
    if (l.includes('items-center justify-between') && i > 100) {
        console.log(i + ': ' + l.trim());
    }
});
