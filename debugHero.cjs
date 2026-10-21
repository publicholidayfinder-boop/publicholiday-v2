const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');
const lines = content.split('\n');
// Print lines 40-80 to see exact current state
lines.slice(39, 80).forEach((l, i) => console.log((i+40) + ': ' + l));
