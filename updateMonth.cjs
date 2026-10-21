const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarMonthGrid.jsx', 'utf-8');

const targetStr = `                                            {day.date.getDate()}
                                        </span>`;

const newStr = `                                            {day.date.getDate()}
                                            {/* Print-only asterisk for holidays in B&W */}
                                            {day.isCurrentMonth && hEvents.length > 0 && (
                                                <span className="hidden print:inline-block ml-0.5 text-black font-bold">*</span>
                                            )}
                                        </span>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync('src/components/calendar/CalendarMonthGrid.jsx', content, 'utf-8');
    console.log('CalendarMonthGrid.jsx updated!');
} else {
    console.log('Could not find target string in CalendarMonthGrid.jsx');
}
