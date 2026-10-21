const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

const idx = lines.findIndex(l => l.includes("title={pinned ? \"Remove from Watchlist\"")) + 8; // after watchlist closing </button>

const todayBtn = [
    '                            <Link',
    '                                to={`/today/${countryCode}`}',
    '                                className="flex items-center gap-1.5 bg-white border border-sky-400 text-sky-700 hover:bg-sky-50 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"',
    '                                title="Is it a public holiday today?"',
    '                            >',
    '                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    '                                Holiday today?',
    '                            </Link>'
];

lines.splice(idx, 0, ...todayBtn);
fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Added "Holiday today?" button to CountryPage.');
