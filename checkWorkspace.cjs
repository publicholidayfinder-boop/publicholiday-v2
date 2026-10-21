const fs = require('fs');
const lines = fs.readFileSync('src/components/calendar/CalendarWorkspace.jsx', 'utf-8').split('\n');
const navIdx = lines.findIndex(l => l.includes('Previous Month'));
if (navIdx > -1) {
    console.log('Nav found at:', navIdx);
    console.log(lines.slice(navIdx - 5, navIdx + 10).map((l, i) => (navIdx-5+i) + ': ' + l).join('\n'));
} else {
    console.log('Nav NOT found');
    const renderIdx = lines.findIndex(l => l.includes('{renderMonthTitle()}'));
    console.log(lines.slice(renderIdx - 3, renderIdx + 5).map((l, i) => (renderIdx-3+i) + ': ' + l).join('\n'));
}
