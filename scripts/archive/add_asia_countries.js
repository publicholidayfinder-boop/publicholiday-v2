import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const asianCountries = [
  { id: 'CN', name: 'China', emoji: '🇨🇳' },
  { id: 'KR', name: 'South Korea', emoji: '🇰🇷' },
  { id: 'SG', name: 'Singapore', emoji: '🇸🇬' },
  { id: 'MY', name: 'Malaysia', emoji: '🇲🇾' },
  { id: 'TH', name: 'Thailand', emoji: '🇹🇭' },
  { id: 'ID', name: 'Indonesia', emoji: '🇮🇩' },
  { id: 'PH', name: 'Philippines', emoji: '🇵🇭' },
  { id: 'VN', name: 'Vietnam', emoji: '🇻🇳' },
  { id: 'BD', name: 'Bangladesh', emoji: '🇧🇩' },
  { id: 'PK', name: 'Pakistan', emoji: '🇵🇰' },
  { id: 'LK', name: 'Sri Lanka', emoji: '🇱🇰' },
  { id: 'NP', name: 'Nepal', emoji: '🇳🇵' },
  { id: 'MM', name: 'Myanmar', emoji: '🇲🇲' },
  { id: 'KH', name: 'Cambodia', emoji: '🇰🇭' },
  { id: 'MN', name: 'Mongolia', emoji: '🇲🇳' },
  { id: 'KZ', name: 'Kazakhstan', emoji: '🇰🇿' },
  { id: 'UZ', name: 'Uzbekistan', emoji: '🇺🇿' },
  { id: 'AZ', name: 'Azerbaijan', emoji: '🇦🇿' },
  { id: 'GE', name: 'Georgia', emoji: '🇬🇪' },
  { id: 'AM', name: 'Armenia', emoji: '🇦🇲' },
  { id: 'HK', name: 'Hong Kong', emoji: '🇭🇰' },
  { id: 'TW', name: 'Taiwan', emoji: '🇹🇼' }
];

const countryDescriptions = {
  CN: "China observes a set of national public holidays reflecting its history, cultural traditions, and political milestones. These holidays affect government services, schools, businesses, and travel across the country.",
  KR: "South Korea observes a mix of traditional and modern public holidays that reflect its cultural heritage, national history, and Confucian traditions. These holidays affect work schedules, schools, and public services.",
  SG: "Singapore observes public holidays that reflect its multicultural society, incorporating Chinese, Malay, Indian, and Western traditions. These holidays shape daily life, business operations, and travel.",
  MY: "Malaysia observes a diverse range of public holidays reflecting its multicultural population of Malay, Chinese, and Indian communities, as well as its Islamic heritage and national history.",
  TH: "Thailand observes public holidays rooted in Buddhism, the monarchy, and national history. These holidays are central to Thai culture and affect government services, schools, and businesses nationwide.",
  ID: "Indonesia observes public holidays that reflect its multicultural population and diverse religious traditions including Islam, Christianity, Hinduism, and Buddhism.",
  PH: "The Philippines observes a range of regular, special, and local holidays rooted in its Christian heritage, national history, and cultural traditions.",
  VN: "Vietnam observes public holidays that mark important national milestones and traditional celebrations reflecting the country's history and cultural identity.",
  BD: "Bangladesh observes public holidays rooted in its national liberation history, Islamic traditions, and Bengali cultural heritage.",
  PK: "Pakistan observes public holidays that reflect its Islamic traditions, national history, and the founding of the nation in 1947.",
  LK: "Sri Lanka observes a diverse range of public holidays rooted in Buddhism, Hinduism, Islam, and Christianity, reflecting the country's multicultural society.",
  NP: "Nepal observes a wide range of public holidays rooted in Hinduism and Buddhism, as well as national events. The country has one of the highest numbers of public holidays in the world.",
  MM: "Myanmar observes public holidays that reflect its Buddhist heritage, national history, and ethnic diversity.",
  KH: "Cambodia observes public holidays rooted in Buddhism, the monarchy, and national history. Khmer New Year is one of the most celebrated holidays in the country.",
  MN: "Mongolia observes public holidays reflecting its nomadic heritage, national history, and Naadam festival traditions.",
  KZ: "Kazakhstan observes a mix of national and cultural holidays reflecting its history as a former Soviet republic and its Kazakh cultural and Islamic heritage.",
  UZ: "Uzbekistan observes public holidays reflecting its national independence, Islamic traditions, and rich Silk Road cultural heritage.",
  AZ: "Azerbaijan observes public holidays reflecting its national independence, Islamic traditions, and Azerbaijani cultural heritage.",
  GE: "Georgia observes public holidays rooted in Orthodox Christianity, national history, and Georgian cultural traditions.",
  AM: "Armenia observes public holidays rooted in the Armenian Apostolic Church, national history, and the commemoration of the Armenian Genocide.",
  HK: "Hong Kong observes a blend of Chinese traditional holidays and public holidays inherited from its British colonial history, reflecting its unique East-meets-West culture.",
  TW: "Taiwan observes public holidays that blend traditional Chinese culture, national history, and modern democratic values."
};

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

async function fetchHolidays(year, countryCode) {
  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    if (res.status === 204 || res.status === 404) {
      console.log(`  No API data for ${countryCode} ${year}`);
      return [];
    }
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error(`  Error fetching ${countryCode} ${year}:`, e.message);
    return [];
  }
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function run() {
  for (const country of asianCountries) {
    // Skip if already exists
    if (data.countries.find(c => c.id === country.id)) {
      console.log(`Country ${country.id} already exists, skipping metadata.`);
    } else {
      data.countries.push({
        id: country.id,
        name: country.name,
        description: {
          en: countryDescriptions[country.id] || `${country.name} observes public holidays that reflect its national history, culture, and traditions.`
        },
        sections: [
          {
            title: `How Public Holidays Are Observed in ${country.name}`,
            content: `On most public holidays in ${country.name}, government offices, schools, and banks are closed. Many private businesses also close or operate on reduced hours. Public transport may run on modified schedules.`
          },
          {
            title: `Why ${country.name}'s Public Holidays Matter`,
            content: `Understanding ${country.name}'s public holidays helps with business planning, payroll management, school scheduling, and travel planning. Both residents and visitors benefit from knowing when services may be unavailable.`
          },
          {
            title: "Frequently Asked Questions",
            items: [
              {
                q: `Are all public holidays observed nationwide in ${country.name}?`,
                a: "Most public holidays are observed nationally, though some regional or state-level holidays may also apply."
              },
              {
                q: "Do businesses close on public holidays?",
                a: "Government offices and banks typically close. Private businesses and retail may remain open with reduced hours."
              },
              {
                q: "Can public holiday dates change?",
                a: "Yes, especially for holidays based on lunar calendars or those declared by the government."
              }
            ]
          }
        ]
      });
    }

    // Fetch for both years
    for (const year of [2026, 2027]) {
      data.holidays = data.holidays.filter(h => !(h.countryCode === country.id && h.year === year));
      const apiHolidays = await fetchHolidays(year, country.id);
      let added = 0;

      for (const h of apiHolidays) {
        if (!h.types || !h.types.includes("Public")) continue;
        const slug = generateSlug(h.name);
        data.holidays.push({
          id: `${country.id.toLowerCase()}-${slug}-${year}`,
          countryCode: country.id,
          slug,
          name: h.name,
          date: h.date,
          year,
          type: "National",
          isPublicHoliday: true,
          description: `Celebrated as ${h.localName} in ${country.name}.`,
          observanceRules: "National public holiday."
        });
        added++;
      }

      console.log(`  ${country.name} (${country.id}) ${year}: ${added} holidays`);
      await new Promise(r => setTimeout(r, 150));
    }
  }

  fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("\nDone. All Asian countries added with 2026 & 2027 holidays.");
}

run();
