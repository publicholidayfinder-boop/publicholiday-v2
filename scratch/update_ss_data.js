import fs from 'fs';
import { execSync } from 'child_process';

const holidaysPath = 'c:/Users/DELL/publicholiday/publicholiday-v2/src/data/holidays.json';
const data = JSON.parse(fs.readFileSync(holidaysPath, 'utf8'));

// 1. Define SS Country Profile
const ssCountry = {
  "id": "SS",
  "name": "South Sudan",
  "region": "Africa",
  "description": {
    "en": "South Sudan observes national public holidays that reflect its history, culture, and traditions. These holidays shape everyday life, affecting work schedules, school terms, travel plans, and the availability of government and public services across the country.",
    "es": "Sudán del Sur observa días festivos nacionales que reflejan su historia, cultura y tradiciones. Estos días festivos dan forma a la vida cotidiana, afectando los horarios de trabajo, los períodos escolares, los planes de viaje y la disponibilidad de servicios públicos y gubernamentales en todo el país.",
    "fr": "Le Soudan du Sud observe des jours fériés nationaux qui reflètent son histoire, sa culture et ses traditions. Ces jours fériés façonnent la vie quotidienne, affectant les horaires de travail, les trimestres scolaires, les plans de voyage et la disponibilité des services publics et gouvernementaux dans tout le pays.",
    "de": "Der Südsudan begeht nationale Feiertage, die seine Geschichte, Kultur und Traditionen widerspiegeln. Diese Feiertage prägen das tägliche Leben und beeinflussen Arbeitszeiten, Schulzeiten, Reisepläne und die Verfügbarkeit von Regierungs- und öffentlichen Diensten im ganzen Land.",
    "pt": "O Sudão do Sul observa feriados nacionais que refletem sua história, cultura e tradições. Esses feriados moldam a vida cotidiana, afetando horários de trabalho, períodos escolares, planos de viagem e a disponibilidade de serviços públicos e governamentais em todo o país.",
    "zh": "南苏丹庆祝反映其历史、文化和传统的国家公共假日。这些假日影响着日常工作、学校学期、旅行计划以及全国政府 and 公共服务的可用性。",
    "ar": "يحتفل جنوب السودان بالعطلات الرسمية الوطنية التي تعكس تاريخه وثقافته وتقاليده. تشكل هذه العطلات الحياة اليومية، وتؤثر على جداول العمل، والفصول الدراسية، وخطط السفر، وتوافر الخدمات الحكومية والعامة في جميع أنحاء البلاد.",
    "ja": "南スーダンは、その歴史、文化、伝統を反映した国家の祝日を遵守しています。これらの祝日は日常生活を形成し、全国の仕事のスケジュール、学校の学期、旅行計画、政府および公共サービスの利用可能性に影響を与えます。"
  },
  "sections": [
    {
      "title": "Important Notice",
      "content": "Public holiday dates and observance rules can change, especially when holidays fall on weekends. Always confirm critical dates with official South Sudan government sources when planning travel, payroll, or business operations."
    },
    {
      "title": "How South Sudan Public Holidays Are Observed",
      "content": "On most public and bank holidays:\n\nBanks and government offices are closed.\nSchools are closed.\nSome businesses operate reduced hours.\nPublic transport and retail services may run modified schedules.\nPrivate businesses are not legally required to close but often adjust operating hours."
    },
    {
      "title": "Why South Sudan Public Holidays Matter",
      "content": "Understanding South Sudan public holidays helps with:\n\nBusiness and payroll planning.\nSchool and academic scheduling.\nTravel and accommodation planning.\nAvoiding service disruptions.\nBoth residents and visitors benefit from knowing when closures and peak travel periods are likely."
    },
    {
      "title": "Additional Observances",
      "content": "Islamic holidays such as Eid al-Fitr and Eid al-Adha are also recognized, but dates vary based on the lunar calendar.\nSome holidays may shift if they fall on weekends or due to government announcements.\n\nFor official and updated holiday announcements, you can check:\n[Government of South Sudan](https://www.egov.ss/)"
    },
    {
      "title": "Frequently Asked Questions",
      "items": [
        {
          "q": "Are South Sudan public holidays the same across all regions?",
          "a": "In most cases, yes, though some regional or provincial holidays may apply depending on local laws."
        },
        {
          "q": "Do all businesses close on public holidays?",
          "a": "No. Many private businesses, especially in hospitality and retail, remain open, though hours may be reduced."
        },
        {
          "q": "Can public holiday dates change?",
          "a": "Yes. Especially when holidays fall on weekends, substitute days are often observed on the following weekdays."
        }
      ]
    }
  ]
};

// Update or append country
const existingCountryIndex = data.countries.findIndex(c => c.id === 'SS');
if (existingCountryIndex !== -1) {
  data.countries[existingCountryIndex] = ssCountry;
} else {
  data.countries.push(ssCountry);
}

// 2. Define SS Holidays for 2026 & 2027
const rawHolidays = [
  // 2026
  { date: "2026-01-01", name: "New Year's Day", slug: "new-year-s-day" },
  { date: "2026-01-09", name: "Peace Agreement Day", slug: "peace-agreement-day" },
  { date: "2026-03-08", name: "International Women's Day", slug: "international-women-s-day" },
  { date: "2026-04-03", name: "Good Friday", slug: "good-friday" },
  { date: "2026-04-06", name: "Easter Monday", slug: "easter-monday" },
  { date: "2026-05-01", name: "Labour Day", slug: "labour-day" },
  { date: "2026-05-16", name: "SPLA Day", slug: "spla-day" },
  { date: "2026-05-25", name: "Africa Day", slug: "africa-day" },
  { date: "2026-07-09", name: "Independence Day", slug: "independence-day" },
  { date: "2026-07-30", name: "Martyrs' Day", slug: "martyrs-day" },
  { date: "2026-12-25", name: "Christmas Day", slug: "christmas-day" },
  // 2027
  { date: "2027-01-01", name: "New Year's Day", slug: "new-year-s-day" },
  { date: "2027-01-09", name: "Peace Agreement Day", slug: "peace-agreement-day" },
  { date: "2027-03-08", name: "International Women's Day", slug: "international-women-s-day" },
  { date: "2027-03-26", name: "Good Friday", slug: "good-friday" },
  { date: "2027-03-29", name: "Easter Monday", slug: "easter-monday" },
  { date: "2027-05-01", name: "Labour Day", slug: "labour-day" },
  { date: "2027-05-16", name: "SPLA Day", slug: "spla-day" },
  { date: "2027-05-25", name: "Africa Day", slug: "africa-day" },
  { date: "2027-07-09", name: "Independence Day", slug: "independence-day" },
  { date: "2027-07-30", name: "Martyrs' Day", slug: "martyrs-day" },
  { date: "2027-12-25", name: "Christmas Day", slug: "christmas-day" }
];

const ssHolidays = rawHolidays.map(h => {
  const year = parseInt(h.date.split('-')[0], 10);
  return {
    id: `ss-${h.slug}-${year}`,
    countryCode: "SS",
    slug: h.slug,
    name: h.name,
    date: h.date,
    year: year,
    type: "National",
    isPublicHoliday: true,
    description: `${h.name} is a public holiday in South Sudan.`,
    observanceRules: "National public holiday.",
    source: "Official government calendar"
  };
});

// Remove existing SS holidays and append new ones
data.holidays = data.holidays.filter(h => h.countryCode !== 'SS');
data.holidays.push(...ssHolidays);

// Write back to monolithic JSON
fs.writeFileSync(holidaysPath, JSON.stringify(data, null, 2));
console.log('✅ Updated src/data/holidays.json successfully!');
