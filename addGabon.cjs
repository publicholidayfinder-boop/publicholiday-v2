const fs = require('fs');
const filePath = 'src/lib/continents.js';
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const insertIndex = lines.findIndex(l => l.includes('};'));
if (insertIndex > -1 && !content.includes(`'GA':`)) {
    lines.splice(insertIndex, 0, `    'GA': 'Africa', // Gabon`);
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Added Gabon to continents.js');
}
