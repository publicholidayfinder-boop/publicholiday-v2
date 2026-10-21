import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicHolidaysDir = path.join(__dirname, '../public/data/holidays');
const srcHolidaysPath = path.join(__dirname, '../src/data/holidays.json');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Comprehensive Nepal Holidays (2025, 2026, 2027)
const nepalHolidays = [
  // 2025
  { date: '2025-01-11', name: 'Prithvi Jayanti (National Unity Day)', year: 2025, type: 'National', description: 'Celebration of the birth anniversary of King Prithvi Narayan Shah, unifier of Nepal.' },
  { date: '2025-01-14', name: 'Maghe Sankranti', year: 2025, type: 'Religious', description: 'Hindu harvest festival marking the transition of the Sun into Capricorn (Makara).' },
  { date: '2025-01-30', name: 'Sonam Lhosar', year: 2025, type: 'Cultural', description: 'New Year festival of the Tamang and Hyolmo communities in Nepal.' },
  { date: '2025-01-30', name: "Martyrs' Day (Shahid Diwas)", year: 2025, type: 'National', description: 'Honoring those who sacrificed their lives for democracy and sovereignty of Nepal.' },
  { date: '2025-02-02', name: 'Saraswati Puja (Basanta Panchami)', year: 2025, type: 'Religious', description: 'Celebration of Saraswati, the Hindu goddess of knowledge, music, and art.' },
  { date: '2025-02-18', name: 'National Democracy Day (Rashtriya Prajatantra Diwas)', year: 2025, type: 'National', description: 'Commemorating the establishment of democracy in Nepal in 1951.' },
  { date: '2025-02-26', name: 'Maha Shivaratri', year: 2025, type: 'Religious', description: 'Great night of Lord Shiva, one of the most sacred Hindu festivals celebrated at Pashupatinath.' },
  { date: '2025-03-01', name: 'Gyalpo Lhosar', year: 2025, type: 'Cultural', description: 'Tibetan New Year celebrated by the Sherpa, Bhutia, and other Himalayan communities.' },
  { date: '2025-03-08', name: "International Women's Day", year: 2025, type: 'Observance', description: 'Global celebration of women\'s rights and social, economic, and cultural achievements.' },
  { date: '2025-03-13', name: 'Fagu Purnima (Holi - Hilly Region)', year: 2025, type: 'Religious', description: 'Festival of colors, love, and spring celebrated in Kathmandu and the hills.' },
  { date: '2025-03-14', name: 'Fagu Purnima (Holi - Terai Region)', year: 2025, type: 'Religious', description: 'Festival of colors celebrated across the southern plains (Terai) of Nepal.' },
  { date: '2025-03-29', name: 'Ghode Jatra', year: 2025, type: 'Cultural', description: 'Horse racing festival celebrated in the Kathmandu Valley at Tundikhel.' },
  { date: '2025-04-06', name: 'Ram Navami', year: 2025, type: 'Religious', description: 'Birth anniversary of Lord Rama, widely celebrated in Janakpur and across Nepal.' },
  { date: '2025-04-14', name: 'Nepali New Year (Navavarsha 2082)', year: 2025, type: 'National', description: 'First day of the Vikram Samvat calendar (Baisakh 1), widely celebrated with Bisket Jatra.' },
  { date: '2025-05-01', name: 'International Labour Day (Majdoor Diwas)', year: 2025, type: 'National', description: 'Honoring workers and the international labor movement.' },
  { date: '2025-05-12', name: 'Buddha Jayanti / Ubhauli Parva', year: 2025, type: 'Religious', description: 'Triple celebration of the birth, enlightenment, and parinirvana of Gautama Buddha at Lumbini.' },
  { date: '2025-05-29', name: 'Republic Day (Ganatantra Diwas)', year: 2025, type: 'National', description: 'Commemorating the declaration of the Federal Democratic Republic of Nepal in 2008.' },
  { date: '2025-08-09', name: 'Janai Purnima / Raksha Bandhan', year: 2025, type: 'Religious', description: 'Sacred thread renewal festival and celebration of the bond between brothers and sisters.' },
  { date: '2025-08-10', name: 'Gai Jatra', year: 2025, type: 'Cultural', description: 'Festival of cows in Kathmandu Valley commemorating deceased family members with humor and satire.' },
  { date: '2025-08-16', name: 'Krishna Janmashtami', year: 2025, type: 'Religious', description: 'Celebration of the birth of Lord Krishna, observed especially at Patan Krishna Mandir.' },
  { date: '2025-08-26', name: 'Haritalika Teej', year: 2025, type: 'Religious', description: 'Fasting and prayer festival celebrated by Hindu women dedicated to Goddess Parvati and Lord Shiva.' },
  { date: '2025-09-06', name: 'Indra Jatra', year: 2025, type: 'Cultural', description: 'Street carnival and chariot procession of Living Goddess Kumari in Kathmandu.' },
  { date: '2025-09-19', name: 'Constitution Day (National Day)', year: 2025, type: 'National', description: 'National Day celebrating the promulgation of the Constitution of Nepal in 2015.' },
  { date: '2025-09-22', name: 'Ghatasthapana (Dashain Begins)', year: 2025, type: 'Religious', description: 'First day of the 15-day Dashain festival, sowing the holy jamara seeds.' },
  { date: '2025-09-29', name: 'Fulpati (Dashain)', year: 2025, type: 'Religious', description: 'Seventh day of Dashain with sacred flowers and plants brought to the palace.' },
  { date: '2025-09-30', name: 'Maha Ashtami (Dashain)', year: 2025, type: 'Religious', description: 'Eighth day of Dashain dedicated to Goddess Durga and Kali.' },
  { date: '2025-10-01', name: 'Maha Navami (Dashain)', year: 2025, type: 'Religious', description: 'Ninth day of Dashain, honoring Vishwakarma and worshiping tools and vehicles.' },
  { date: '2025-10-02', name: 'Vijaya Dashami (Dashain Main Day)', year: 2025, type: 'Religious', description: 'Tenth and primary day of Dashain; elders apply Tika and Jamara to bless younger relatives.' },
  { date: '2025-10-03', name: 'Papankusha Ekadashi (Dashain)', year: 2025, type: 'Religious', description: 'Eleventh day of Dashain continuing blessings and visits with family.' },
  { date: '2025-10-05', name: 'Kojagrat Purnima (Dashain End)', year: 2025, type: 'Religious', description: 'Full moon night marking the conclusion of the Dashain festival.' },
  { date: '2025-10-20', name: 'Laxmi Puja (Tihar)', year: 2025, type: 'Religious', description: 'Festival of lights honoring Laxmi, the Hindu goddess of wealth and prosperity.' },
  { date: '2025-10-21', name: 'Govardhan Puja / Mha Puja (Tihar)', year: 2025, type: 'Religious', description: 'Newari New Year (Nepal Sambat) and worship of the inner self and oxen.' },
  { date: '2025-10-22', name: 'Bhai Tika (Tihar Main Day)', year: 2025, type: 'Religious', description: 'Sisters honor brothers with seven-colored tika and garlands, wishing them long life.' },
  { date: '2025-10-27', name: 'Chhath Puja', year: 2025, type: 'Religious', description: 'Sun God Surya festival celebrated along rivers and lakes for health and longevity.' },
  { date: '2025-12-25', name: 'Christmas Day', year: 2025, type: 'Religious', description: 'Christian holiday celebrating the birth of Jesus Christ.' },
  { date: '2025-12-30', name: 'Tamu Lhosar', year: 2025, type: 'Cultural', description: 'New Year festival of the Gurung community celebrated across Nepal.' },

  // 2026
  { date: '2026-01-11', name: 'Prithvi Jayanti (National Unity Day)', year: 2026, type: 'National', description: 'Celebration of the birth anniversary of King Prithvi Narayan Shah, unifier of Nepal.' },
  { date: '2026-01-15', name: 'Maghe Sankranti', year: 2026, type: 'Religious', description: 'Hindu harvest festival marking the transition of the Sun into Capricorn (Makara).' },
  { date: '2026-01-23', name: 'Saraswati Puja (Basanta Panchami)', year: 2026, type: 'Religious', description: 'Celebration of Saraswati, the Hindu goddess of knowledge, music, and art.' },
  { date: '2026-01-30', name: "Martyrs' Day (Shahid Diwas)", year: 2026, type: 'National', description: 'Honoring those who sacrificed their lives for democracy and sovereignty of Nepal.' },
  { date: '2026-02-15', name: 'Maha Shivaratri', year: 2026, type: 'Religious', description: 'Great night of Lord Shiva, one of the most sacred Hindu festivals celebrated at Pashupatinath.' },
  { date: '2026-02-17', name: 'Sonam Lhosar', year: 2026, type: 'Cultural', description: 'New Year festival of the Tamang and Hyolmo communities in Nepal.' },
  { date: '2026-02-18', name: 'National Democracy Day (Rashtriya Prajatantra Diwas)', year: 2026, type: 'National', description: 'Commemorating the establishment of democracy in Nepal in 1951.' },
  { date: '2026-02-18', name: 'Gyalpo Lhosar', year: 2026, type: 'Cultural', description: 'Tibetan New Year celebrated by the Sherpa, Bhutia, and other Himalayan communities.' },
  { date: '2026-03-02', name: 'Fagu Purnima (Holi - Hilly Region)', year: 2026, type: 'Religious', description: 'Festival of colors, love, and spring celebrated in Kathmandu and the hills.' },
  { date: '2026-03-03', name: 'Fagu Purnima (Holi - Terai Region)', year: 2026, type: 'Religious', description: 'Festival of colors celebrated across the southern plains (Terai) of Nepal.' },
  { date: '2026-03-08', name: "International Women's Day", year: 2026, type: 'Observance', description: 'Global celebration of women\'s rights and social, economic, and cultural achievements.' },
  { date: '2026-03-19', name: 'Ghode Jatra', year: 2026, type: 'Cultural', description: 'Horse racing festival celebrated in the Kathmandu Valley at Tundikhel.' },
  { date: '2026-03-27', name: 'Ram Navami', year: 2026, type: 'Religious', description: 'Birth anniversary of Lord Rama, widely celebrated in Janakpur and across Nepal.' },
  { date: '2026-04-14', name: 'Nepali New Year (Navavarsha 2083)', year: 2026, type: 'National', description: 'First day of the Vikram Samvat calendar (Baisakh 1), widely celebrated with Bisket Jatra.' },
  { date: '2026-05-01', name: 'International Labour Day (Majdoor Diwas)', year: 2026, type: 'National', description: 'Honoring workers and the international labor movement.' },
  { date: '2026-05-01', name: 'Buddha Jayanti / Ubhauli Parva', year: 2026, type: 'Religious', description: 'Triple celebration of the birth, enlightenment, and parinirvana of Gautama Buddha at Lumbini.' },
  { date: '2026-05-29', name: 'Republic Day (Ganatantra Diwas)', year: 2026, type: 'National', description: 'Commemorating the declaration of the Federal Democratic Republic of Nepal in 2008.' },
  { date: '2026-08-28', name: 'Janai Purnima / Raksha Bandhan', year: 2026, type: 'Religious', description: 'Sacred thread renewal festival and celebration of the bond between brothers and sisters.' },
  { date: '2026-08-29', name: 'Gai Jatra', year: 2026, type: 'Cultural', description: 'Festival of cows in Kathmandu Valley commemorating deceased family members with humor and satire.' },
  { date: '2026-09-04', name: 'Krishna Janmashtami', year: 2026, type: 'Religious', description: 'Celebration of the birth of Lord Krishna, observed especially at Patan Krishna Mandir.' },
  { date: '2026-09-14', name: 'Haritalika Teej', year: 2026, type: 'Religious', description: 'Fasting and prayer festival celebrated by Hindu women dedicated to Goddess Parvati and Lord Shiva.' },
  { date: '2026-09-19', name: 'Constitution Day (National Day)', year: 2026, type: 'National', description: 'National Day celebrating the promulgation of the Constitution of Nepal in 2015.' },
  { date: '2026-09-25', name: 'Indra Jatra', year: 2026, type: 'Cultural', description: 'Street carnival and chariot procession of Living Goddess Kumari in Kathmandu.' },
  { date: '2026-10-11', name: 'Ghatasthapana (Dashain Begins)', year: 2026, type: 'Religious', description: 'First day of the 15-day Dashain festival, sowing the holy jamara seeds.' },
  { date: '2026-10-18', name: 'Fulpati (Dashain)', year: 2026, type: 'Religious', description: 'Seventh day of Dashain with sacred flowers and plants brought to the palace.' },
  { date: '2026-10-19', name: 'Maha Ashtami (Dashain)', year: 2026, type: 'Religious', description: 'Eighth day of Dashain dedicated to Goddess Durga and Kali.' },
  { date: '2026-10-20', name: 'Maha Navami (Dashain)', year: 2026, type: 'Religious', description: 'Ninth day of Dashain, honoring Vishwakarma and worshiping tools and vehicles.' },
  { date: '2026-10-21', name: 'Vijaya Dashami (Dashain Main Day)', year: 2026, type: 'Religious', description: 'Tenth and primary day of Dashain; elders apply Tika and Jamara to bless younger relatives.' },
  { date: '2026-10-22', name: 'Ekadashi (Dashain)', year: 2026, type: 'Religious', description: 'Eleventh day of Dashain continuing blessings and visits with family.' },
  { date: '2026-10-25', name: 'Kojagrat Purnima (Dashain End)', year: 2026, type: 'Religious', description: 'Full moon night marking the conclusion of the Dashain festival.' },
  { date: '2026-11-08', name: 'Laxmi Puja (Tihar)', year: 2026, type: 'Religious', description: 'Festival of lights honoring Laxmi, the Hindu goddess of wealth and prosperity.' },
  { date: '2026-11-09', name: 'Govardhan Puja / Mha Puja (Tihar)', year: 2026, type: 'Religious', description: 'Newari New Year (Nepal Sambat) and worship of the inner self and oxen.' },
  { date: '2026-11-10', name: 'Bhai Tika (Tihar Main Day)', year: 2026, type: 'Religious', description: 'Sisters honor brothers with seven-colored tika and garlands, wishing them long life.' },
  { date: '2026-11-15', name: 'Chhath Puja', year: 2026, type: 'Religious', description: 'Sun God Surya festival celebrated along rivers and lakes for health and longevity.' },
  { date: '2026-12-25', name: 'Christmas Day', year: 2026, type: 'Religious', description: 'Christian holiday celebrating the birth of Jesus Christ.' },
  { date: '2026-12-30', name: 'Tamu Lhosar', year: 2026, type: 'Cultural', description: 'New Year festival of the Gurung community celebrated across Nepal.' },

  // 2027
  { date: '2027-01-11', name: 'Prithvi Jayanti (National Unity Day)', year: 2027, type: 'National', description: 'Celebration of the birth anniversary of King Prithvi Narayan Shah, unifier of Nepal.' },
  { date: '2027-01-15', name: 'Maghe Sankranti', year: 2027, type: 'Religious', description: 'Hindu harvest festival marking the transition of the Sun into Capricorn (Makara).' },
  { date: '2027-01-30', name: "Martyrs' Day (Shahid Diwas)", year: 2027, type: 'National', description: 'Honoring those who sacrificed their lives for democracy and sovereignty of Nepal.' },
  { date: '2027-02-06', name: 'Sonam Lhosar', year: 2027, type: 'Cultural', description: 'New Year festival of the Tamang and Hyolmo communities in Nepal.' },
  { date: '2027-02-08', name: 'Gyalpo Lhosar', year: 2027, type: 'Cultural', description: 'Tibetan New Year celebrated by the Sherpa, Bhutia, and other Himalayan communities.' },
  { date: '2027-02-11', name: 'Saraswati Puja (Basanta Panchami)', year: 2027, type: 'Religious', description: 'Celebration of Saraswati, the Hindu goddess of knowledge, music, and art.' },
  { date: '2027-02-18', name: 'National Democracy Day (Rashtriya Prajatantra Diwas)', year: 2027, type: 'National', description: 'Commemorating the establishment of democracy in Nepal in 1951.' },
  { date: '2027-03-06', name: 'Maha Shivaratri', year: 2027, type: 'Religious', description: 'Great night of Lord Shiva, one of the most sacred Hindu festivals celebrated at Pashupatinath.' },
  { date: '2027-03-08', name: "International Women's Day", year: 2027, type: 'Observance', description: 'Global celebration of women\'s rights and social, economic, and cultural achievements.' },
  { date: '2027-03-21', name: 'Fagu Purnima (Holi - Hilly Region)', year: 2027, type: 'Religious', description: 'Festival of colors, love, and spring celebrated in Kathmandu and the hills.' },
  { date: '2027-03-22', name: 'Fagu Purnima (Holi - Terai Region)', year: 2027, type: 'Religious', description: 'Festival of colors celebrated across the southern plains (Terai) of Nepal.' },
  { date: '2027-04-07', name: 'Ghode Jatra', year: 2027, type: 'Cultural', description: 'Horse racing festival celebrated in the Kathmandu Valley at Tundikhel.' },
  { date: '2027-04-14', name: 'Nepali New Year (Navavarsha 2084)', year: 2027, type: 'National', description: 'First day of the Vikram Samvat calendar (Baisakh 1), widely celebrated with Bisket Jatra.' },
  { date: '2027-04-15', name: 'Ram Navami', year: 2027, type: 'Religious', description: 'Birth anniversary of Lord Rama, widely celebrated in Janakpur and across Nepal.' },
  { date: '2027-05-01', name: 'International Labour Day (Majdoor Diwas)', year: 2027, type: 'National', description: 'Honoring workers and the international labor movement.' },
  { date: '2027-05-20', name: 'Buddha Jayanti / Ubhauli Parva', year: 2027, type: 'Religious', description: 'Triple celebration of the birth, enlightenment, and parinirvana of Gautama Buddha at Lumbini.' },
  { date: '2027-05-29', name: 'Republic Day (Ganatantra Diwas)', year: 2027, type: 'National', description: 'Commemorating the declaration of the Federal Democratic Republic of Nepal in 2008.' },
  { date: '2027-08-17', name: 'Janai Purnima / Raksha Bandhan', year: 2027, type: 'Religious', description: 'Sacred thread renewal festival and celebration of the bond between brothers and sisters.' },
  { date: '2027-08-18', name: 'Gai Jatra', year: 2027, type: 'Cultural', description: 'Festival of cows in Kathmandu Valley commemorating deceased family members with humor and satire.' },
  { date: '2027-08-25', name: 'Krishna Janmashtami', year: 2027, type: 'Religious', description: 'Celebration of the birth of Lord Krishna, observed especially at Patan Krishna Mandir.' },
  { date: '2027-09-04', name: 'Haritalika Teej', year: 2027, type: 'Religious', description: 'Fasting and prayer festival celebrated by Hindu women dedicated to Goddess Parvati and Lord Shiva.' },
  { date: '2027-09-14', name: 'Indra Jatra', year: 2027, type: 'Cultural', description: 'Street carnival and chariot procession of Living Goddess Kumari in Kathmandu.' },
  { date: '2027-09-20', name: 'Constitution Day (National Day)', year: 2027, type: 'National', description: 'National Day celebrating the promulgation of the Constitution of Nepal in 2015.' },
  { date: '2027-09-30', name: 'Ghatasthapana (Dashain Begins)', year: 2027, type: 'Religious', description: 'First day of the 15-day Dashain festival, sowing the holy jamara seeds.' },
  { date: '2027-10-06', name: 'Fulpati (Dashain)', year: 2027, type: 'Religious', description: 'Seventh day of Dashain with sacred flowers and plants brought to the palace.' },
  { date: '2027-10-07', name: 'Maha Ashtami (Dashain)', year: 2027, type: 'Religious', description: 'Eighth day of Dashain dedicated to Goddess Durga and Kali.' },
  { date: '2027-10-08', name: 'Maha Navami (Dashain)', year: 2027, type: 'Religious', description: 'Ninth day of Dashain, honoring Vishwakarma and worshiping tools and vehicles.' },
  { date: '2027-10-09', name: 'Vijaya Dashami (Dashain Main Day)', year: 2027, type: 'Religious', description: 'Tenth and primary day of Dashain; elders apply Tika and Jamara to bless younger relatives.' },
  { date: '2027-10-10', name: 'Ekadashi (Dashain)', year: 2027, type: 'Religious', description: 'Eleventh day of Dashain continuing blessings and visits with family.' },
  { date: '2027-10-13', name: 'Kojagrat Purnima (Dashain End)', year: 2027, type: 'Religious', description: 'Full moon night marking the conclusion of the Dashain festival.' },
  { date: '2027-10-29', name: 'Laxmi Puja (Tihar)', year: 2027, type: 'Religious', description: 'Festival of lights honoring Laxmi, the Hindu goddess of wealth and prosperity.' },
  { date: '2027-10-30', name: 'Govardhan Puja / Mha Puja (Tihar)', year: 2027, type: 'Religious', description: 'Newari New Year (Nepal Sambat) and worship of the inner self and oxen.' },
  { date: '2027-10-31', name: 'Bhai Tika (Tihar Main Day)', year: 2027, type: 'Religious', description: 'Sisters honor brothers with seven-colored tika and garlands, wishing them long life.' },
  { date: '2027-11-04', name: 'Chhath Puja', year: 2027, type: 'Religious', description: 'Sun God Surya festival celebrated along rivers and lakes for health and longevity.' },
  { date: '2027-12-25', name: 'Christmas Day', year: 2027, type: 'Religious', description: 'Christian holiday celebrating the birth of Jesus Christ.' },
  { date: '2027-12-30', name: 'Tamu Lhosar', year: 2027, type: 'Cultural', description: 'New Year festival of the Gurung community celebrated across Nepal.' }
].map(h => {
  const slug = slugify(h.name);
  return {
    id: `np-${slug}-${h.year}`,
    countryCode: 'NP',
    slug: slug,
    name: h.name,
    date: h.date,
    year: h.year,
    type: h.type,
    isPublicHoliday: h.type !== 'Observance',
    description: h.description,
    observanceRules: 'National public holiday in Nepal.',
    source: 'Government of Nepal Gazette'
  };
});

// 1. Write Nepal public holidays file
fs.writeFileSync(
  path.join(publicHolidaysDir, 'NP.json'),
  JSON.stringify(nepalHolidays, null, 2),
  'utf8'
);
console.log(`✅ Wrote ${nepalHolidays.length} holidays to public/data/holidays/NP.json`);

// 2. Also populate KH, MM, MN, UZ from src/data/holidays.json if they are empty
const srcData = JSON.parse(fs.readFileSync(srcHolidaysPath, 'utf8'));

// Update srcData with Nepal holidays
srcData.holidays = srcData.holidays.filter(h => h.countryCode !== 'NP').concat(nepalHolidays);
fs.writeFileSync(srcHolidaysPath, JSON.stringify(srcData, null, 2), 'utf8');
console.log('✅ Updated src/data/holidays.json with Nepal holidays');

// Populate other empty ones from srcData
['KH', 'MM', 'MN', 'UZ'].forEach(code => {
  const filePath = path.join(publicHolidaysDir, `${code}.json`);
  const current = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
  if (current.length === 0) {
    const fromSrc = srcData.holidays.filter(h => h.countryCode === code);
    if (fromSrc.length > 0) {
      fs.writeFileSync(filePath, JSON.stringify(fromSrc, null, 2), 'utf8');
      console.log(`✅ Populated ${fromSrc.length} holidays for ${code} in public/data/holidays/`);
    }
  }
});
