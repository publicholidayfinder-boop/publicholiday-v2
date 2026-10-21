import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/holidays.json');
const outputDir = path.join(__dirname, '../public/og/countries');

// Emoji flag map (ISO 3166-1 alpha-2 → flag emoji)
function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    const codePoints = [...countryCode.toUpperCase()].map(
        char => 127397 + char.charCodeAt(0)
    );
    return String.fromCodePoint(...codePoints);
}

// Escape XML special characters for SVG text
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Generate SVG OG image (1200×630)
function generateSVG(countryName, countryCode, holidayCount) {
    const flag = getFlagEmoji(countryCode);
    const safeCountryName = escapeXml(countryName);
    const currentYear = new Date().getFullYear();

    // Adjust font size based on country name length
    let nameFontSize = 72;
    if (countryName.length > 20) nameFontSize = 56;
    if (countryName.length > 28) nameFontSize = 46;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Dark gradient background -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e3a5f;stop-opacity:1" />
    </linearGradient>
    <!-- Accent gradient -->
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b;stop-opacity:0.95" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:0.95" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Decorative circles -->
  <circle cx="1050" cy="100" r="200" fill="#0ea5e9" opacity="0.06"/>
  <circle cx="150" cy="530" r="150" fill="#6366f1" opacity="0.06"/>

  <!-- Accent bar top -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#accent)" />

  <!-- Card -->
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="url(#cardBg)" filter="url(#shadow)" />

  <!-- Left accent strip -->
  <rect x="80" y="80" width="6" height="470" rx="3" fill="url(#accent)" />

  <!-- Flag emoji -->
  <text x="170" y="280" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
        font-size="120" text-anchor="start" dominant-baseline="middle">${flag}</text>

  <!-- Country name -->
  <text x="330" y="230" font-family="Inter, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="${nameFontSize}" font-weight="800" fill="#f8fafc"
        text-anchor="start" dominant-baseline="middle">${safeCountryName}</text>

  <!-- Subtitle -->
  <text x="330" y="315" font-family="Inter, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="36" font-weight="400" fill="#94a3b8"
        text-anchor="start" dominant-baseline="middle">Public Holidays ${currentYear}</text>

  <!-- Divider line -->
  <line x1="330" y1="365" x2="1080" y2="365" stroke="#334155" stroke-width="1.5"/>

  <!-- Holiday count badge -->
  <rect x="330" y="385" width="220" height="52" rx="12" fill="#0ea5e9" opacity="0.15" />
  <text x="440" y="411" font-family="Inter, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="22" font-weight="700" fill="#38bdf8"
        text-anchor="middle" dominant-baseline="middle">🗓 ${holidayCount} Holidays</text>

  <!-- Free badge -->
  <rect x="568" y="385" width="140" height="52" rx="12" fill="#10b981" opacity="0.15" />
  <text x="638" y="411" font-family="Inter, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="22" font-weight="700" fill="#34d399"
        text-anchor="middle" dominant-baseline="middle">✓ Free</text>

  <!-- Branding -->
  <text x="600" y="508" font-family="Inter, Segoe UI, Helvetica Neue, Arial, sans-serif"
        font-size="26" font-weight="700" fill="#475569"
        text-anchor="middle" dominant-baseline="middle">publicholidayfinder.com</text>
</svg>`;
}

async function run() {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Reading holidays.json...');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Count holidays per country (use 2026)
    const holidayCountByCountry = {};
    for (const h of data.holidays) {
        if (h.year === 2026) {
            holidayCountByCountry[h.countryCode] = (holidayCountByCountry[h.countryCode] || 0) + 1;
        }
    }

    let generated = 0;
    for (const country of data.countries) {
        const count = holidayCountByCountry[country.id] || 0;
        const svg = generateSVG(country.name, country.id, count);
        const outputPath = path.join(outputDir, `${country.id}.svg`);
        fs.writeFileSync(outputPath, svg, 'utf8');
        generated++;
        if (generated % 20 === 0) {
            console.log(`Generated ${generated}/${data.countries.length}...`);
        }
    }

    console.log(`✅ Generated ${generated} OG images in public/og/countries/`);
}

run();
