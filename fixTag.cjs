const fs = require('fs');
const lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');
const insertIdx = lines.findIndex(l => l.includes('<section className="py-16 bg-white">'));
if (insertIdx > -1) {
    lines.splice(insertIdx, 0, '            </section>');
    fs.writeFileSync('src/pages/HomePage.jsx', lines.join('\n'), 'utf-8');
    console.log('Added missing </section>.');
} else {
    console.log('Could not find features section.');
}
