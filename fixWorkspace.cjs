const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarWorkspace.jsx', 'utf-8');

// Remove the nav block that was wrongly prepended to the file
const navBlock = `                        {viewMode === "month" && (
                            <div className="flex items-center gap-1 print:hidden">
                                <button
                                    onClick={() => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))}
                                    className="p-1 rounded hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors"
                                    title="Previous Month"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))}
                                    className="p-1 rounded hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors"
                                    title="Next Month"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}
`;

// Remove it from the top
if (content.startsWith(navBlock.trimStart())) {
    content = content.slice(navBlock.trimStart().length);
    console.log('Removed bad nav block from top.');
} else {
    // just remove the first 18 lines (the nav block that got prepended)
    const lines = content.split('\n');
    content = lines.slice(18).join('\n');
    console.log('Removed first 18 lines (bad nav block).');
}

// Now find the correct place: after {renderMonthTitle()} inside the header
const FIND = '{renderMonthTitle()}';
const insertAfter = content.indexOf(FIND) + FIND.length;

const newNav = `
                        {viewMode === "month" && (
                            <div className="flex items-center gap-1 print:hidden">
                                <button
                                    onClick={() => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))}
                                    className="p-1 rounded hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors"
                                    title="Previous Month"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))}
                                    className="p-1 rounded hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors"
                                    title="Next Month"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}`;

// Also update the const destructuring to include setCurrentMonth and viewMode
content = content.replace(
    'const { currentMonth } = useCalendar();',
    'const { currentMonth, setCurrentMonth, viewMode } = useCalendar();'
);

content = content.slice(0, insertAfter) + newNav + content.slice(insertAfter);

fs.writeFileSync('src/components/calendar/CalendarWorkspace.jsx', content, 'utf-8');
console.log('Fixed CalendarWorkspace with nav buttons in the right place.');
