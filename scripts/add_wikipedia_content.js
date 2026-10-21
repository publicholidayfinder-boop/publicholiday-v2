import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/holidays.json');

// Helper to fetch Wikipedia summary
async function fetchWikipediaSummary(countryName) {
    try {
        // Special case overrides for Wikipedia URL slugs
        let slug = countryName;
        if (countryName === 'United States') slug = 'United_States';
        if (countryName === 'United Kingdom') slug = 'United_Kingdom';
        // URL encode the slug to handle spaces and special characters
        const encodedSlug = encodeURIComponent(slug.replace(/ /g, '_'));
        
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedSlug}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'PublicHolidayFinder/1.0 (Contact: hello@publicholidayfinder.com)'
            }
        });
        
        if (!response.ok) {
            console.warn(`[Warning] Could not fetch Wikipedia for ${countryName} (${response.status})`);
            return null;
        }
        
        const data = await response.json();
        return data.extract;
    } catch (e) {
        console.error(`[Error] Wikipedia fetch failed for ${countryName}:`, e.message);
        return null;
    }
}

// Introduce a delay to avoid rate-limiting
const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
    console.log('Reading holidays.json...');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    let updatedCount = 0;

    for (let i = 0; i < data.countries.length; i++) {
        const country = data.countries[i];
        
        // Initialize sections if missing (e.g. Japan)
        if (!country.sections) {
            country.sections = [];
        }
        
        // Check if an "About" section already exists
        const hasAbout = country.sections.some(s => {
            if (!s.title) return false;
            const titleStr = typeof s.title === 'object' ? (s.title.en || '') : s.title;
            return titleStr.startsWith('About');
        });
        
        if (!hasAbout) {
            console.log(`[${i+1}/${data.countries.length}] Fetching summary for ${country.name}...`);
            const summary = await fetchWikipediaSummary(country.name);
            
            if (summary) {
                // Add the new section at the top
                country.sections.unshift({
                    title: `About ${country.name}`,
                    content: summary
                });
                updatedCount++;
            }
            
            // Wait 100ms between requests to be gentle on Wikipedia API
            await delay(100);
        } else {
            console.log(`[${i+1}/${data.countries.length}] ${country.name} already has an About section, skipping.`);
        }
    }
    
    if (updatedCount > 0) {
        console.log(`Writing changes to holidays.json... (${updatedCount} countries updated)`);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log('✅ Success! Run node scripts/split_data.js to update public files.');
    } else {
        console.log('No updates were made.');
    }
}

run();
