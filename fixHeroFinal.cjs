const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// Find the start of the broken area (just after "query-input" line)
// and the end just before the Hero Search Box section
const ANCHOR_START = `"query-input": "required name=country_code"`;
const ANCHOR_END = `{/* Hero Search Box - left aligned, white pill */}`;

const startIdx = content.indexOf(ANCHOR_START);
const endIdx = content.indexOf(ANCHOR_END);

if (startIdx === -1) {
    console.log('ANCHOR_START not found');
    process.exit(1);
}
if (endIdx === -1) {
    console.log('ANCHOR_END not found');
    process.exit(1);
}

console.log('Start anchor at char:', startIdx);
console.log('End anchor at char:', endIdx);
console.log('Removing chars:', startIdx, 'to', endIdx - 1);

const before = content.slice(0, startIdx + ANCHOR_START.length);
const after = content.slice(endIdx);

const middle = `
                        }
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "PublicHolidayFinder",
                        "url": "https://publicholidayfinder.com",
                        "logo": "https://publicholidayfinder.com/icon-512.png"
                    }
                ]}
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 text-white" style={{ minHeight: '220px' }}>
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/hero-banner.png')",
                        backgroundPosition: 'center center',
                        opacity: 0.85
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/10" />

                <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
                    <div className="max-w-lg animate-fade-in">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-tight leading-tight">
                            Find Public Holidays<br />
                            <span className="text-emerald-400">Around the World</span>
                        </h1>
                        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-sm mb-6 font-normal">
                            Accurate dates, calendars and information<br />for every country.
                        </p>

                        `;

fs.writeFileSync('src/pages/HomePage.jsx', before + middle + after, 'utf-8');
console.log('Fixed!');
