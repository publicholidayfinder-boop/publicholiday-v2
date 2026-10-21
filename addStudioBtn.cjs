const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

const idx = lines.findIndex(l => l.includes('title="Open printable year planner"'));
const endAIdx = lines.findIndex((l, i) => i > idx && l.includes('</Link>'));

const studioBtn = [
    '                            <Link',
    '                                to={`/calendar-generator?country=${countryCode}&year=${year}`}',
    '                                className="flex items-center gap-1.5 bg-white border border-rose-400 text-rose-700 hover:bg-rose-50 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"',
    '                                title="Open in Calendar Studio"',
    '                            >',
    '                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>',
    '                                Studio',
    '                            </Link>'
];

lines.splice(endAIdx + 1, 0, ...studioBtn);
fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Added Studio button to CountryPage.');
