const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// Replace the hero background and gradient logic
const oldBg = `<section className="relative overflow-hidden bg-slate-900 text-white" style={{ minHeight: '220px' }}>
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
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-tight leading-tight">`;

const newBg = `<section className="relative overflow-hidden bg-[#0a3866] text-white" style={{ minHeight: '350px', display: 'flex', alignItems: 'center' }}>
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
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-tight leading-tight drop-shadow-md">`;

if (content.includes(oldBg)) {
    content = content.replace(oldBg, newBg);
    
    // Also add drop-shadow to the paragraph
    content = content.replace(
        '<p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-sm mb-6 font-normal">',
        '<p className="text-sm md:text-base text-white/90 leading-relaxed max-w-sm mb-6 font-medium drop-shadow">'
    );
    
    fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
    console.log('Successfully updated the banner overlay and positioning.');
} else {
    console.log('Could not find the exact string to replace. Checking lines...');
}
