import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../src/data/holidays.json');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const ci = data.countries.find(c => c.id === 'CI');
console.log('CI Country Object:', JSON.stringify(ci, null, 2));
