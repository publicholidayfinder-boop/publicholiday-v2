const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// The mangled strings we found:
content = content.replace(/dYO\?/g, '??');
content = content.replace(/dY'\uFFFD/g, '??');
content = content.replace(/\uFFFD\?\uFFFD,\?/g, '??');
content = content.replace(/dY\-"\uFFFD,\?/g, '???');
content = content.replace(/dY"\?/g, '??');
content = content.replace(/\uFFFDo /g, '?');
content = content.replace(/A\uFFFD /g, '— ');

fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
console.log('Restored emojis in HomePage.jsx');
