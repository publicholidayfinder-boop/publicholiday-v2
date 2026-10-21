const fs = require('fs');
let lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');

// Lines 144-147 are duplicate closing tags from the old section. Remove lines 145,146,147 (0-indexed: 144,145,146)
// Line 144 (index 143) = </section>  <- correct close from our new fix
// Line 145 (index 144) = </div>      <- duplicate leftover
// Line 146 (index 145) = </div>      <- duplicate leftover
// Line 147 (index 146) = </section>  <- duplicate leftover
lines.splice(144, 3);

fs.writeFileSync('src/pages/HomePage.jsx', lines.join('\n'), 'utf-8');
console.log('Removed duplicate closing tags. Total lines:', lines.length);
