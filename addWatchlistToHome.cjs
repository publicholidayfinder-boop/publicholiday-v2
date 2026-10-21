const fs = require('fs');
const lines = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8').split('\n');

const importIdx = lines.findIndex(l => l.includes('TodayGlobalHolidays'));
lines.splice(importIdx, 0, "import PersonalWatchlist from '../components/PersonalWatchlist';");

const targetIdx = lines.findIndex(l => l.includes('<TodayGlobalHolidays />')) - 2;

lines.splice(targetIdx, 0, "            <PersonalWatchlist />");

fs.writeFileSync('src/pages/HomePage.jsx', lines.join('\n'), 'utf-8');
console.log('Added PersonalWatchlist to HomePage.');
