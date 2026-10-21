const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');
const lines = content.split('\n');

// Find where the search input SVG path sits (now wrongly inside JSON)
// The correct anchor is the line with "@type": "SearchAction"
const brokenStart = lines.findIndex(l => l.includes('"@type": "SearchAction"'));
// Find first line with "placeholder" (the search input) - that's where we rejoin
const brokenEnd = lines.findIndex(l => l.includes('placeholder="Search for a country..."'));

console.log('brokenStart:', brokenStart, '->', lines[brokenStart]);
console.log('brokenEnd:', brokenEnd, '->', lines[brokenEnd]);

const cleanHead = lines.slice(0, brokenStart);
const cleanTail = lines.slice(brokenEnd);

const insertion = [
    '                            "@type": "SearchAction",',
    '                            "target": {',
    '                                "@type": "EntryPoint",',
    '                                "urlTemplate": "https://publicholidayfinder.com/country/{country_code}/{year}"',
    '                            },',
    '                            "query-input": "required name=country_code"',
    '                        }',
    '                    },',
    '                    {',
    '                        "@context": "https://schema.org",',
    '                        "@type": "Organization",',
    '                        "name": "PublicHolidayFinder",',
    '                        "url": "https://publicholidayfinder.com",',
    '                        "logo": "https://publicholidayfinder.com/icon-512.png"',
    '                    }',
    '                ]}',
    '            />',
    '',
    '            {/* Hero Section */}',
    '            <section className="relative overflow-hidden bg-slate-900 text-white" style={{ minHeight: \'220px\' }}>',
    '                {/* Background image */}',
    '                <div',
    '                    className="absolute inset-0 bg-cover bg-center"',
    '                    style={{',
    "                        backgroundImage: \"url('/images/hero-banner.png')\",",
    "                        backgroundPosition: 'center center',",
    '                        opacity: 0.85',
    '                    }}',
    '                />',
    '                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/10" />',
    '',
    '                <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">',
    '                    <div className="max-w-lg animate-fade-in">',
    '                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-tight leading-tight">',
    '                            Find Public Holidays<br />',
    '                            <span className="text-emerald-400">Around the World</span>',
    '                        </h1>',
    '                        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-sm mb-6 font-normal">',
    '                            Accurate dates, calendars and information<br />for every country.',
    '                        </p>',
    '',
    '                        {/* Hero Search Box */}',
    '                        <div className="max-w-md relative bg-white p-1.5 rounded-full shadow-xl flex items-center">',
    '                            <svg className="ml-3 w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
    '                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />',
    '                            </svg>',
    '                            <input',
];

const fixed = [...cleanHead, ...insertion, ...cleanTail];
fs.writeFileSync('src/pages/HomePage.jsx', fixed.join('\n'), 'utf-8');
console.log('Fixed! Wrote', fixed.length, 'lines.');
