const fs = require('fs');
const path = require('path');
const dir = 'public/data/holidays';
const files = fs.readdirSync(dir);
let found = [];
files.forEach(f => {
    try {
        const content = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
        const holidays = content.holidays || content || [];
        const arr = Array.isArray(holidays) ? holidays : Object.values(holidays).flat();
        arr.forEach(h => {
            if (h && h.name && typeof h.name === 'object') {
                found.push({ file: f, date: h.date, name: h.name });
            }
        });
    } catch(e) {}
});
console.log('Total holidays with object names:', found.length);
found.slice(0, 10).forEach(x => console.log(x.file, x.date, JSON.stringify(x.name)));
