const fs = require('fs');
const lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');

// Insert onClick scrollTo after line 480 (the `to=` prop of the country grid cards)
// and after line 169 (the `to=` prop of the hero quick links)
// We need to find the exact lines

const scrollOnClick = "                                                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}";
const scrollOnClickHero = "                                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}";

// Find the grid card link - look for 'to={`/country/${country.id}/${selectedYear}`}'
let gridIdx = -1;
let heroIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('to={`/country/${country.id}/${selectedYear}`}') && lines[i+1] && lines[i+1].includes('className="card text-center')) {
        gridIdx = i;
    }
    if (lines[i].includes('to={`/country/${c.id}/${selectedYear}`}') && lines[i+1] && lines[i+1].includes('className="flex items-center gap-1.5 px-3')) {
        heroIdx = i;
    }
}

console.log('Grid card link at:', gridIdx, 'Hero quick link at:', heroIdx);

if (gridIdx > -1) {
    lines.splice(gridIdx + 1, 0, scrollOnClick);
}
// Hero index shifts by 1 if grid was found first
if (heroIdx > -1) {
    const offset = gridIdx > -1 && gridIdx < heroIdx ? 1 : 0;
    lines.splice(heroIdx + 1 + offset, 0, scrollOnClickHero);
}

fs.writeFileSync('src/pages/HomePage.jsx', lines.join('\n'), 'utf-8');
console.log('Done.');
