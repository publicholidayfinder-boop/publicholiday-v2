import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// North American countries (excluding US & CA which already exist)
const naCountries = [
  { id: 'MX', name: 'Mexico', emoji: '🇲🇽' },
  { id: 'GT', name: 'Guatemala', emoji: '🇬🇹' },
  { id: 'BZ', name: 'Belize', emoji: '🇧🇿' },
  { id: 'HN', name: 'Honduras', emoji: '🇭🇳' },
  { id: 'SV', name: 'El Salvador', emoji: '🇸🇻' },
  { id: 'NI', name: 'Nicaragua', emoji: '🇳🇮' },
  { id: 'CR', name: 'Costa Rica', emoji: '🇨🇷' },
  { id: 'PA', name: 'Panama', emoji: '🇵🇦' },
  { id: 'CU', name: 'Cuba', emoji: '🇨🇺' },
  { id: 'JM', name: 'Jamaica', emoji: '🇯🇲' },
  { id: 'HT', name: 'Haiti', emoji: '🇭🇹' },
  { id: 'DO', name: 'Dominican Republic', emoji: '🇩🇴' },
  { id: 'TT', name: 'Trinidad and Tobago', emoji: '🇹🇹' },
  { id: 'BB', name: 'Barbados', emoji: '🇧🇧' },
  { id: 'LC', name: 'Saint Lucia', emoji: '🇱🇨' },
  { id: 'VC', name: 'Saint Vincent and the Grenadines', emoji: '🇻🇨' },
  { id: 'GD', name: 'Grenada', emoji: '🇬🇩' },
  { id: 'AG', name: 'Antigua and Barbuda', emoji: '🇦🇬' },
  { id: 'DM', name: 'Dominica', emoji: '🇩🇲' },
  { id: 'KN', name: 'Saint Kitts and Nevis', emoji: '🇰🇳' },
  { id: 'BS', name: 'Bahamas', emoji: '🇧🇸' },
];

const holidaysFilePath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysFilePath, 'utf8'));

async function fetchHolidays(year, countryCode) {
  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    if (res.status === 204) {
      console.warn(`  No content (204) for ${countryCode} in ${year}`);
      return [];
    }
    if (!res.ok) {
      console.warn(`  Failed to fetch for ${countryCode} in ${year}: ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (e) {
    console.error(`  Error fetching ${countryCode}:`, e.message);
    return [];
  }
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildCountryEntry(country) {
  return {
    id: country.id,
    name: country.name,
    description: {
      en: `${country.name} observes a set of national public holidays that reflect its history, culture, and traditions. These holidays shape everyday life, affecting work schedules, school terms, travel plans, and the availability of government and public services across the country.`,
      es: `${country.name} observa un conjunto de días festivos nacionales que reflejan su historia, cultura y tradiciones. Estos días festivos dan forma a la vida cotidiana, afectando los horarios de trabajo, los períodos escolares, los planes de viaje y la disponibilidad de servicios gubernamentales y públicos en todo el país.`,
      fr: `${country.name} observe un ensemble de jours fériés nationaux qui reflètent son histoire, sa culture et ses traditions. Ces jours fériés façonnent la vie quotidienne, affectant les horaires de travail, les périodes scolaires, les plans de voyage et la disponibilité des services gouvernementaux et publics dans tout le pays.`,
      de: `${country.name} beobachtet eine Reihe nationaler Feiertage, die seine Geschichte, Kultur und Traditionen widerspiegeln. Diese Feiertage prägen das tägliche Leben und beeinflussen Arbeitszeiten, Schulzeiten, Reisepläne und die Verfügbarkeit von Regierungs- und öffentlichen Diensten im ganzen Land.`,
      pt: `${country.name} observa um conjunto de feriados nacionais que refletem sua história, cultura e tradições. Esses feriados moldam a vida cotidiana, afetando horários de trabalho, períodos escolares, planos de viagem e a disponibilidade de serviços governamentais e públicos em todo o país.`,
      zh: `${country.name}庆祝一系列反映其历史、文化和传统的国家公共假日。这些假日影响日常生活，包括工作时间表、学期、旅行计划以及全国各地政府和公共服务的可用性。`,
      ar: `تحتفل ${country.name} بمجموعة من الأعياد الوطنية التي تعكس تاريخها وثقافتها وتقاليدها. تؤثر هذه الأعياد على الحياة اليومية، بما في ذلك جداول العمل والفصول الدراسية وخطط السفر وتوافر الخدمات الحكومية والعامة في جميع أنحاء البلاد.`,
      ja: `${country.name}は、その歴史、文化、伝統を反映した国家的な祝日を設けています。これらの祝日は、全国の勤務スケジュール、学期、旅行計画、政府・公共サービスの利用可能性に影響を与え、日常生活を形作っています。`
    },
    sections: [
      {
        title: `Important Notice`,
        content: `Public holiday dates and observance rules can change, especially when holidays fall on weekends. Always confirm critical dates with official ${country.name} government sources when planning travel, payroll, or business operations.`
      },
      {
        title: `How Public Holidays Are Observed in ${country.name}`,
        content: `On most public holidays in ${country.name}:\n\nGovernment offices and banks are closed.\nSchools are closed.\nSome businesses operate reduced hours.\nPublic transport and retail services may run modified schedules.\nPrivate businesses are not always required to close but often adjust operating hours.`
      },
      {
        title: `Why ${country.name}'s Public Holidays Matter`,
        content: `Understanding ${country.name}'s public holidays helps with:\n\nBusiness and payroll planning.\nSchool and academic scheduling.\nTravel and accommodation planning.\nAvoiding service disruptions.\nBoth residents and visitors benefit from knowing when closures and peak travel periods are likely.`
      },
      {
        title: `Frequently Asked Questions`,
        items: [
          {
            q: `Are all public holidays observed nationwide in ${country.name}?`,
            a: `Most public holidays are observed nationwide, though some regions or states may have additional local holidays.`
          },
          {
            q: `Do businesses close on public holidays in ${country.name}?`,
            a: `Government offices and banks typically close. Private businesses may close or operate on reduced hours depending on local regulations.`
          },
          {
            q: `Can public holiday dates change in ${country.name}?`,
            a: `Yes. When a holiday falls on a weekend, it may be observed on a nearby weekday. Always check official sources for confirmed dates.`
          }
        ]
      }
    ]
  };
}

async function run() {
  for (const country of naCountries) {
    // Check if country already exists
    const exists = data.countries.find(c => c.id === country.id);
    if (!exists) {
      data.countries.push(buildCountryEntry(country));
      console.log(`Added country profile: ${country.name}`);
    } else {
      console.log(`Country profile already exists: ${country.name}, skipping profile...`);
    }

    // Fetch and add 2026 holidays (remove existing first)
    for (const year of [2026, 2027]) {
      // Remove existing entries for this country+year
      data.holidays = data.holidays.filter(h => !(h.countryCode === country.id && h.year === year));

      const apiHolidays = await fetchHolidays(year, country.id);
      let added = 0;

      for (const h of apiHolidays) {
        if (!h.types || !h.types.includes('Public')) continue;
        const slug = generateSlug(h.name);
        data.holidays.push({
          id: `${country.id.toLowerCase()}-${slug}-${year}`,
          countryCode: country.id,
          slug: slug,
          name: h.name,
          date: h.date,
          year: year,
          type: 'National',
          isPublicHoliday: true,
          description: `Celebrated as ${h.localName} in ${country.name}.`,
          observanceRules: 'National public holiday.'
        });
        added++;
      }

      console.log(`  Added ${added} holidays for ${country.name} (${country.id}) in ${year}`);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  fs.writeFileSync(holidaysFilePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('\nDone. All North American countries added with 2026 and 2027 holidays.');
}

run();
