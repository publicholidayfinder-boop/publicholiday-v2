const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// Replace all mangled emojis in Features section
const emojis = ['🌍', '🚀', '🖨️'];
let count = 0;
content = content.replace(/<div className="text-5xl mb-4">.*?<\/div>/g, (match) => {
    // skip the empty state globe since it's already fixed
    if (match.includes('🌍') && count >= 3) return match; 
    const repl = `<div className="text-5xl mb-4">${emojis[count % 3]}</div>`;
    count++;
    return repl;
});

fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf-8');
console.log('Fixed features emojis.');
