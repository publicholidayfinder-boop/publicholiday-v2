const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarMonthGrid.jsx', 'utf-8');

// Remove the asterisk span
const oldSpan = `{/* Print-only asterisk for holidays in B&W */}
                                            {day.isCurrentMonth && hEvents.length > 0 && (
                                                <span className="hidden print:inline-block ml-0.5 text-black font-bold">*</span>
                                            )}`;
content = content.replace(oldSpan, '');

// Now add the underline to the main span's className
// The current span looks like this:
//                                         <span
//                                             className={`text-base font-bold ${day.isCurrentMonth ? '' : 'font-normal'} ${
//                                                 isToday ? 'w-7 h-7 flex items-center justify-center rounded-full border-2 text-sm' : ''
//                                             }`}

// We need to inject the print:underline into the className. We can do it by replacing the className block.
const oldClass = "isToday ? 'w-7 h-7 flex items-center justify-center rounded-full border-2 text-sm' : ''";
const newClass = "isToday ? 'w-7 h-7 flex items-center justify-center rounded-full border-2 text-sm' : ''\n                                            } ${day.isCurrentMonth && hEvents.length > 0 ? 'print:underline decoration-[1.5px] underline-offset-[2px]' : ''}";

content = content.replace(oldClass, newClass);

fs.writeFileSync('src/components/calendar/CalendarMonthGrid.jsx', content, 'utf-8');
console.log('CalendarMonthGrid updated to use underline instead of asterisk.');
