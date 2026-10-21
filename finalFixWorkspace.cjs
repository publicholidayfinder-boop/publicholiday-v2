const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarWorkspace.jsx', 'utf-8');

// It still has JSX prepended before the import. Remove everything before "import React"
const importIdx = content.indexOf('import React');
if (importIdx > 0) {
    content = content.slice(importIdx);
    console.log('Stripped junk before import. New start:', content.substring(0, 50));
}

// Now find renderMonthTitle and insert AFTER it
const FIND = '{renderMonthTitle()}';
const insertAfter = content.indexOf(FIND) + FIND.length;
if (insertAfter < FIND.length) {
    console.log('renderMonthTitle NOT found!');
    process.exit(1);
}

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

// Check if nav already exists (don't double-add)
if (content.includes('Previous Month')) {
    console.log('Nav already exists in correct position, just stripping preamble.');
} else {
    content = content.slice(0, insertAfter) + newNav + content.slice(insertAfter);
    console.log('Inserted nav after renderMonthTitle.');
}

// Fix destructuring if needed
if (!content.includes('setCurrentMonth')) {
    content = content.replace(
        'const { currentMonth } = useCalendar();',
        'const { currentMonth, setCurrentMonth, viewMode } = useCalendar();'
    );
    console.log('Fixed destructuring.');
}

fs.writeFileSync('src/components/calendar/CalendarWorkspace.jsx', content, 'utf-8');
console.log('Done. First line now:', content.split('\n')[0].substring(0, 60));
