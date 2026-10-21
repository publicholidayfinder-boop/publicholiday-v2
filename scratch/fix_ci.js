import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../src/data/holidays.json');

const wikiSummary = "Ivory Coast, also known as Côte d'Ivoire and officially as the Republic of Côte d'Ivoire, is a country on the southern coast of West Africa. Its capital city of Yamoussoukro is located in the centre of the country, while its largest city and economic centre is the port city of Abidjan. It borders Guinea to the northwest, Liberia to the west, Mali to the northwest, Burkina Faso to the northeast, Ghana to the east, and the Atlantic Ocean's Gulf of Guinea to the south. With 31.5 million inhabitants in 2024, Ivory Coast is the third-most populous country in West Africa. Its official language is French, and indigenous languages are also widely used, including Bété, Baoulé, Dyula, Dan, Anyin, and Cebaara Senufo. In total, there are around 78 languages spoken in Ivory Coast. The country has a religiously diverse population, including numerous followers of Islam, Christianity and traditional faiths often entailing animism.";

async function run() {
    console.log('Reading holidays.json...');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Find CI country
    const ciIdx = data.countries.findIndex(c => c.id === 'CI');
    if (ciIdx === -1) {
        console.error('Could not find CI country in holidays.json');
        return;
    }
    
    const ci = data.countries[ciIdx];
    console.log('Original CI Name:', ci.name);
    
    // Update name
    ci.name = "Côte d'Ivoire";
    
    // Update description.en
    if (ci.description && ci.description.en) {
        ci.description.en = ci.description.en.replace(/CÃ´te d'Ivoire/g, "Côte d'Ivoire");
    }
    
    // Clear and build clean sections
    ci.sections = [
        {
            title: "About Côte d'Ivoire",
            content: wikiSummary
        },
        {
            title: "How Public Holidays Are Observed in Côte d'Ivoire",
            content: "On most public holidays in Côte d'Ivoire, government offices, schools, and banks are closed. Many private businesses also close or operate on reduced hours."
        },
        {
            title: "Frequently Asked Questions",
            items: [
                {
                    q: "Are all public holidays observed nationwide in Côte d'Ivoire?",
                    a: "Yes, most public holidays are observed nationally."
                },
                {
                    q: "Do businesses close on public holidays?",
                    a: "Generally yes, though essential services and some retail sectors may remain open."
                }
            ]
        }
    ];
    
    console.log('Updated CI sections to include Wikipedia summary!');
    
    // Save holidays.json
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('Saved holidays.json!');
}

run();
