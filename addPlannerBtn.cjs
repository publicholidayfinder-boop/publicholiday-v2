const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// Insert Year Planner button after the closing </button> of the Share button (line 617)
const plannerBtn = [
    '                            <Link',
    '                                to={`/country/${countryCode}/${year}/planner`}',
    '                                className="flex items-center gap-1.5 bg-white border border-violet-400 text-violet-700 hover:bg-violet-50 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"',
    '                                title="Open printable year planner"',
    '                            >',
    '                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
    '                                Year Planner',
    '                            </Link>',
];

// Insert after line 617 (the closing </button> of the Share button)
lines.splice(618, 0, ...plannerBtn);

fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Year Planner button added to CountryPage.');
