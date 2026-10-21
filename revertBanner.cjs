const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

const currentBg = `<section className="relative overflow-hidden bg-[#0a3866] text-white" style={{ minHeight: '350px', display: 'flex', alignItems: 'center' }}>
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover"
                    style={{
                        backgroundImage: "url('/images/hero-banner.png')",
                        backgroundPosition: 'center right',
                    }}
                />
                
                <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
                    <div className="max-w-lg animate-fade-in">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-tight leading-tight drop-shadow-md">
                            Find Public Holidays<br />
                            <span className="text-emerald-400">Around the World</span>
                        </h1>
                        <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-sm mb-6 font-medium drop-shadow">
                            Accurate dates, calendars and information<br />for every country.
                        </p>`;

const originalBg = `{/* Hero Section with Cultural Landmark Photography & Integrated Search */}
            <section className="relative overflow-hidden bg-slate-900 text-white" style={{ minHeight: '220px' }}>
                {/* Background image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: \`url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1600&auto=format&fit=crop')\`,
                        backgroundPosition: 'center 40%',
                        opacity: 0.55
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/30" />

                <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
                    <div className="max-w-lg animate-fade-in">
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-tight leading-tight">
                            Find Public Holidays<br />
                            <span className="text-white">Around the World</span>
                        </h1>
                        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-sm mb-6 font-normal">
                            Accurate dates, calendars and information<br />for every country.
                        </p>`;

if (content.includes(currentBg)) {
    content = content.replace(currentBg, originalBg);
    fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
    console.log('Successfully reverted the banner to the original state.');
} else {
    console.log('Could not find the exact string to replace.');
}
