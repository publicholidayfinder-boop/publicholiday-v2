const fs = require('fs');
let content = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8');

// Fix desktop NeighboringCountries links
content = content.replace(
    `<Link
                        key={country.id}
                        to={\`/country/\${country.id}/\${year}\`}
                        className="flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all group min-w-[160px] flex-shrink-0"
                    >`,
    `<Link
                        key={country.id}
                        to={\`/country/\${country.id}/\${year}\`}
                        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                        className="flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all group min-w-[160px] flex-shrink-0"
                    >`
);

// Fix mobile MobileNeighboringCountries links
content = content.replace(
    `<Link
                    key={country.id}
                    to={\`/country/\${country.id}/\${year}\`}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all group"`,
    `<Link
                    key={country.id}
                    to={\`/country/\${country.id}/\${year}\`}
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all group"`
);

fs.writeFileSync('src/pages/CountryPage.jsx', content, 'utf-8');
console.log('Added scrollTo top on Related Countries links.');
