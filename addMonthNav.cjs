const fs = require('fs');
const lines = fs.readFileSync('src/components/calendar/CalendarWorkspace.jsx', 'utf-8').split('\n');

const currentMonthIdx = lines.findIndex(l => l.includes('const { currentMonth } = useCalendar();'));
lines[currentMonthIdx] = '    const { currentMonth, setCurrentMonth, viewMode } = useCalendar();';

const renderMonthTitleIdx = lines.findIndex(l => l.includes('{renderMonthTitle()}'));

const navBtns = [
    '                        {viewMode === "month" && (',
    '                            <div className="flex items-center gap-1 print:hidden">',
    '                                <button',
    '                                    onClick={() => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))}',
    '                                    className="p-1 rounded hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors"',
    '                                    title="Previous Month"',
    '                                >',
    '                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>',
    '                                </button>',
    '                                <button',
    '                                    onClick={() => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))}',
    '                                    className="p-1 rounded hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors"',
    '                                    title="Next Month"',
    '                                >',
    '                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>',
    '                                </button>',
    '                            </div>',
    '                        )}'
];

lines.splice(renderMonthTitleIdx + 1, 0, ...navBtns);

fs.writeFileSync('src/components/calendar/CalendarWorkspace.jsx', lines.join('\n'), 'utf-8');
console.log('Added month navigation buttons.');
