const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// Inject the Filter Toggle Bar between line 384 (the outer div) and line 385 (the overflow-x-auto div)
// Line 385 = `                            <div className="overflow-x-auto">`
// We insert after line 384

const toggleBar = [
    '                            {/* Filter Toggle Bar */}',
    '                            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/60 print:hidden">',
    '                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">',
    '                                    {displayedHolidays.length} {publicOnly ? \'Public\' : \'Total\'} Holiday{displayedHolidays.length !== 1 ? \'s\' : \'\'}',
    '                                </span>',
    '                                <button',
    '                                    onClick={() => setPublicOnly(prev => !prev)}',
    '                                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${',
    '                                        publicOnly',
    '                                            ? \'bg-emerald-600 text-white border-emerald-600 shadow-sm\'',
    '                                            : \'bg-white text-slate-600 border-slate-300 hover:border-emerald-400 hover:text-emerald-700\'',
    '                                    }`}',
    '                                    title={publicOnly ? \'Show all holidays\' : \'Show public holidays only\'}',
    '                                >',
    '                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
    '                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />',
    '                                    </svg>',
    '                                    {publicOnly ? \'✓ Public Only\' : \'Public Only\'}',
    '                                </button>',
    '                            </div>',
];

// Insert after line index 384 (0-indexed)
lines.splice(385, 0, ...toggleBar);

// Now fix the table to use displayedHolidays instead of holidays
// After the splice, the old lines shift up by toggleBar.length
// Find and patch the `holidays.length === 0` and the `.map()` references
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(') : holidays.length === 0 ? (')) {
        lines[i] = lines[i].replace('holidays.length === 0', 'displayedHolidays.length === 0');
    }
    if (lines[i].includes('(mobileExpanded ? holidays : holidays.slice(')) {
        lines[i] = lines[i].replace(
            '(mobileExpanded ? holidays : holidays.slice(0, typeof window !== \'undefined\' && window.innerWidth < 640 && !window.matchMedia(\'print\').matches ? 5 : holidays.length))',
            '(mobileExpanded ? displayedHolidays : displayedHolidays.slice(0, typeof window !== \'undefined\' && window.innerWidth < 640 && !window.matchMedia(\'print\').matches ? 5 : displayedHolidays.length))'
        );
    }
    if (lines[i].includes('{holidays.length > 5 && (')) {
        lines[i] = lines[i].replace('{holidays.length > 5 && (', '{displayedHolidays.length > 5 && (');
    }
}

fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Injected toggle bar and patched table references.');
