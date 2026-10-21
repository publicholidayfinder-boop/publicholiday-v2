const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// 1. Restore "What's New" section entirely
const whatsNewStart = content.indexOf('<div className="max-w-5xl mx-auto">');
const whatsNewEnd = content.indexOf('</section>', whatsNewStart) + '</section>'.length;

const correctWhatsNew = `<div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest flex-shrink-0">
                                What's New
                            </span>
                            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                                Exciting new tools & coverage
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">🌍</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">199 Countries & Territories</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    We've expanded! We now cover 199 nations and territories globally, including all major Asian, African, Americas and Oceania countries.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">💼</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Working Days Calculator</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Calculate exact business days, weekends, and holidays between dates for any country.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">⏱️</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Live Local Time</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Check accurate local time, UTC offsets, DST rules, and holiday countdowns.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">🖨️</div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Enhanced Print Studio</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Easily toggle between monthly and yearly views, now with perfect 1-page printing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;

if (whatsNewStart > -1 && whatsNewEnd > whatsNewStart) {
    content = content.substring(0, whatsNewStart) + correctWhatsNew + content.substring(whatsNewEnd);
} else {
    console.log("Could not find What's New section boundaries.");
}

// 2. Fix the Free forever dash
content = content.replace(/Free forever.*?No account needed/g, "Free forever — No account needed");

// 3. Fix the search bar magnifying glass
content = content.replace(/<span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">[\s\S]*?<\/span>/g, `<span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">\n                                🔍\n                            </span>`);

// 4. Fix the search clear cross button
content = content.replace(/aria-label="Clear search">\s*.*?<\/button>/g, `aria-label="Clear search">\n                                    ❌\n                                </button>`);

// 5. Fix the empty state globe
content = content.replace(/<div className="text-5xl mb-4">.*?<\/div>/g, `<div className="text-5xl mb-4">🌍</div>`);

fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
console.log('Fixed HomePage.jsx');
