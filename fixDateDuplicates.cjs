const fs = require('fs');

const countriesRaw = fs.readFileSync('./public/data/countries.json', 'utf-8');
const countriesList = JSON.parse(countriesRaw);
const codes = countriesList.map(c => c.id);

let totalMerged = 0;
let updatedCount = 0;

const typePriority = {
    'public': 4,
    'bank': 3,
    'observance': 2,
    'optional': 1,
    'National': 0
};

console.log(`Starting date deduplication for ${codes.length} countries...`);

for (const code of codes) {
    const filePath = `./public/data/holidays/${code}.json`;
    if (!fs.existsSync(filePath)) continue;
    
    const holidays = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Group by date
    const byDate = new Map();
    for (const h of holidays) {
        if (!byDate.has(h.date)) {
            byDate.set(h.date, [h]);
        } else {
            byDate.get(h.date).push(h);
        }
    }
    
    const finalHolidays = [];
    
    // Merge dates
    for (const [date, hList] of byDate.entries()) {
        if (hList.length === 1) {
            finalHolidays.push(hList[0]);
        } else {
            totalMerged++;
            
            // Sort by priority (highest first)
            hList.sort((a, b) => {
                const aPri = typePriority[a.type] || 0;
                const bPri = typePriority[b.type] || 0;
                return bPri - aPri;
            });
            
            const best = hList[0];
            
            // Collect unique names
            const uniqueNames = [];
            for (const item of hList) {
                if (!uniqueNames.includes(item.name)) {
                    uniqueNames.push(item.name);
                }
            }
            
            const mergedName = uniqueNames.join(' / ');
            
            finalHolidays.push({
                ...best,
                name: mergedName,
                description: mergedName
            });
        }
    }
    
    // Sort final by date just in case
    finalHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    fs.writeFileSync(filePath, JSON.stringify(finalHolidays, null, 2));
    updatedCount++;
}

console.log(`\nFinished! Merged holidays on the exact same date ${totalMerged} times across ${updatedCount} countries.`);
