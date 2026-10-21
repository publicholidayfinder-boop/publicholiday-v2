const fs = require('fs');
const lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');
const printCardEnd = lines.findIndex(l => l.includes('Enhanced Print Studio')) + 4; // up to </p></div>

const newCards = [
    '                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">',
    '                                <div className="text-3xl mb-2">⭐</div>',
    '                                <h3 className="font-bold text-slate-800 text-sm mb-1">Personal Watchlist</h3>',
    '                                <p className="text-xs text-slate-600 leading-relaxed">',
    '                                    Pin up to 5 countries and track their upcoming holidays directly on your homepage dashboard.',
    '                                </p>',
    '                            </div>',
    '                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">',
    '                                <div className="text-3xl mb-2">📅</div>',
    '                                <h3 className="font-bold text-slate-800 text-sm mb-1">Printable Year Planner</h3>',
    '                                <p className="text-xs text-slate-600 leading-relaxed">',
    '                                    Generate a beautiful, color-coded, one-page A4 year planner for any country with a single click.',
    '                                </p>',
    '                            </div>'
];

lines.splice(printCardEnd + 1, 0, ...newCards);

// Find the grid container to adjust columns if needed (it is currently xl:grid-cols-5, wait no it was xl:grid-cols-5. 4+2=6, so change to xl:grid-cols-6 if we want one row, or just lg:grid-cols-3 and drop xl)
// Let's change `xl:grid-cols-5` to `xl:grid-cols-3` so it makes 2 nice rows of 3.
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4')) {
        lines[i] = lines[i].replace('xl:grid-cols-5', '');
    }
}

fs.writeFileSync('src/pages/HomePage.jsx', lines.join('\n'), 'utf-8');
console.log('Added new feature cards to HomePage.');
