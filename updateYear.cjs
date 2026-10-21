const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarYearGrid.jsx', 'utf-8');

const targetStr = `                                <span className="relative z-10 leading-none">{day.date.getDate()}</span>`;

const newStr = '                                <span className={`relative z-10 leading-none ${holidayStyle ? "print:underline decoration-[0.5px] underline-offset-[1px]" : ""}`}>{day.date.getDate()}</span>';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync('src/components/calendar/CalendarYearGrid.jsx', content, 'utf-8');
    console.log('CalendarYearGrid.jsx updated!');
} else {
    console.log('Could not find target string in CalendarYearGrid.jsx');
}
