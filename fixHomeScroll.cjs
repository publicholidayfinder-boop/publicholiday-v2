const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// 1. Add scrollTo to the main country grid cards (line 479 area)
content = content.replace(
    `<Link
                                                key={country.id}
                                                to={\`/country/\${country.id}/\${selectedYear}\`}
                                                className="card text-center hover:shadow-2xl hover:-translate-y-1 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:scale-105 flex flex-col items-center gap-2 py-4 px-2"
                                                aria-label={\`View public holidays for \${country.name}\`}
                                            >`,
    `<Link
                                                key={country.id}
                                                to={\`/country/\${country.id}/\${selectedYear}\`}
                                                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                                className="card text-center hover:shadow-2xl hover:-translate-y-1 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:scale-105 flex flex-col items-center gap-2 py-4 px-2"
                                                aria-label={\`View public holidays for \${country.name}\`}
                                            >`
);

// 2. Add scrollTo to the hero quick-links (line 169 area)
content = content.replace(
    `<Link
                                key={c.id}
                                to={\`/country/\${c.id}/\${selectedYear}\`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all flex-shrink-0 group"
                            >`,
    `<Link
                                key={c.id}
                                to={\`/country/\${c.id}/\${selectedYear}\`}
                                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all flex-shrink-0 group"
                            >`
);

// Also patch the navigate() calls (line 101, 115, 23) — those use programmatic navigation,
// add scrollTo before navigate by replacing the navigate calls
content = content.replace(
    `navigate(\`/country/\${match.id}/\${selectedYear}\`);`,
    `window.scrollTo({ top: 0, left: 0, behavior: 'instant' });\n            navigate(\`/country/\${match.id}/\${selectedYear}\`);`
);

fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
console.log('Added scrollTo on all country links in HomePage.');
