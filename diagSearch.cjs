const fs = require('fs');
let lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');

// Find the broken spot - line 130 has `if (match) {` then immediately jumps to closing divs
const brokenLine = lines.findIndex(l => l.includes('if (match) {') && lines[lines.indexOf(l)+1] && lines[lines.indexOf(l)+1].includes('</div>'));

// Actually let's just find "if (match) {" near line 130
let matchIdx = -1;
for (let i = 125; i < 140; i++) {
    if (lines[i] && lines[i].includes('if (match) {')) {
        matchIdx = i;
        break;
    }
}

console.log('matchIdx:', matchIdx);
console.log('line at matchIdx:', lines[matchIdx]);
console.log('line after:', lines[matchIdx + 1]);
