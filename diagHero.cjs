const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');
const lines = content.split('\n');

// Find the precise start (line with "@type": "SearchAction") and end (closing </section> of hero)
const searchActionLine = lines.findIndex(l => l.includes('"@type": "SearchAction"'));
// Find the hero section closing </section> - it comes after the search button
const heroEndLine = lines.findIndex((l, i) => i > 90 && l.includes('</section>'));

console.log('searchActionLine:', searchActionLine);
console.log('heroEndLine:', heroEndLine);
console.log('Line at searchAction:', lines[searchActionLine]);
console.log('Line at heroEnd:', lines[heroEndLine]);
