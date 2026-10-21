import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../src/data/holidays.json');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Check for suspicious patterns in country names
data.countries.forEach(c => {
    if (c.name.includes('Ã') || c.name.includes('Â')) {
        console.log(`Suspicious country name: "${c.name}" (ID: ${c.id})`);
    }
    if (c.sections) {
        c.sections.forEach(s => {
            const title = typeof s.title === 'object' ? JSON.stringify(s.title) : s.title;
            const content = typeof s.content === 'object' ? JSON.stringify(s.content) : s.content;
            if (title && (title.includes('Ã') || title.includes('Â'))) {
                console.log(`  Suspicious section title in ${c.id}: "${title}"`);
            }
            if (content && (content.includes('Ã') || content.includes('Â'))) {
                console.log(`  Suspicious section content in ${c.id} (length ${content.length})`);
            }
        });
    }
});
