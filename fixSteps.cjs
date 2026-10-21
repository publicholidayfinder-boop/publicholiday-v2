const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// Replace mangled icons
content = content.replace(/Ã°Å¸Å’Â /g, '🌍');
content = content.replace(/Ã°Å¸â€œâ€¦/g, '📅');
content = content.replace(/Ã°Å¸Å½Â¨/g, '🎨');
content = content.replace(/Ã¢Å¡â„¢Ã¯Â¸Â /g, '⚙️');
content = content.replace(/Ã°Å¸â€œÂ¥/g, '📥');
content = content.replace(/Ã¢â€ â€™/g, '→');

// Replace mangled em-dash
content = content.replace(/Ã¢â‚¬â€ /g, '—');

// Fix the misplaced empty globe on line 388/389 that overwrote the CTA note
content = content.replace(/<div className="text-5xl mb-4">🌍<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/, `<p className="text-slate-400 text-sm mt-3">{t('steps.ctaNote', 'Free forever — No account needed')}</p>\n                    </div>\n                </div>\n            </section>`);

fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
console.log('Fixed Steps and CTA sections.');
