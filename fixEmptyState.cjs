const fs = require('fs');
const lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');
lines[490] = '                                        <div className="text-5xl mb-4">🌍</div>';
fs.writeFileSync('src/pages/HomePage.jsx', lines.join('\n'), 'utf-8');
