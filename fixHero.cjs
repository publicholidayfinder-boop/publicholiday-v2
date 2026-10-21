const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// The file is corrupted at lines 57-58 with JSX leaked into the JSON array.
// Find and fix the broken section by replacing the bad chunk
const bad = `                    {
                            <span className="text-white">Around the World</span>
                        </h1>
                        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-sm mb-6 font-normal">
                            Accurate dates, calendars and information<br />for every country.
                        </p>`;

const good = `                    {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "PublicHolidayFinder",
                            "url": "https://publicholidayfinder.com",
                            "logo": "https://publicholidayfinder.com/icon-512.png"
                        }
                ]}
            />

            {/* Hero Section with Cultural Landmark Photography & Integrated Search */}
            <section className="relative overflow-hidden bg-slate-900 text-white" style={{ minHeight: '220px' }}>
                {/* Background image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: \`url('/images/hero-banner.png')\`,
                        backgroundPosition: 'center center',
                        opacity: 0.85
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/10" />

                <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
                    <div className="max-w-lg animate-fade-in">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-tight leading-tight">
                            Find Public Holidays<br />
                            <span className="text-white">Around the World</span>
                        </h1>
                        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-sm mb-6 font-normal">
                            Accurate dates, calendars and information<br />for every country.
                        </p>`;

if (content.includes(bad)) {
    content = content.replace(bad, good);
    fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
    console.log('Fixed! Hero section restored with new banner.');
} else {
    console.log('Pattern not found - checking current state...');
    const idx = content.indexOf('"@context"');
    console.log('First @context at char:', idx);
    const heroIdx = content.indexOf('hero-banner');
    console.log('hero-banner at char:', heroIdx);
}
