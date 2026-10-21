const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// 1. Add import after FlagImage import
const flagIdx = lines.findIndex(l => l.includes("import FlagImage from '../components/FlagImage'"));
lines.splice(flagIdx + 1, 0, "import HolidayHeatmap from '../components/HolidayHeatmap';");

// 2. Add viewMode state inside CountryPage function
const stateIdx = lines.findIndex(l => l.includes("const [copied, setCopied] = useState(false);"));
lines.splice(stateIdx, 0, "    const [viewMode, setViewMode] = useState('table'); // 'table' | 'heatmap'");

fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Added import and viewMode state.');
