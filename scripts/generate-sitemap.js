#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Run this script to regenerate public/sitemap.xml from countries.json.
 * Usage: node scripts/generate-sitemap.js
 * 
 * Also called automatically during: npm run build
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://publicholidayfinder.com';
const CURRENT_YEAR = new Date().getFullYear();
// Include current year, last year, and next year for country pages
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

// Load countries
const countriesPath = join(__dirname, '..', 'public', 'data', 'countries.json');
const countries = JSON.parse(readFileSync(countriesPath, 'utf-8'));

const today = new Date().toISOString().split('T')[0];

// Static routes — homepage and utility pages
const staticRoutes = [
    { path: '/',                    priority: '1.0', changefreq: 'weekly'  },
    { path: '/calendar-generator',  priority: '0.7', changefreq: 'monthly' },
    { path: '/compare',             priority: '0.6', changefreq: 'monthly' },
    { path: '/about',               priority: '0.4', changefreq: 'monthly' },
    { path: '/privacy',             priority: '0.3', changefreq: 'yearly'  },
    { path: '/disclaimer',          priority: '0.3', changefreq: 'yearly'  },
];

// Build country routes for each year
const countryRoutes = [];
for (const country of countries) {
    for (const year of YEARS) {
        countryRoutes.push({
            path: `/country/${country.id}/${year}`,
            priority: '0.9',
            changefreq: 'weekly',
        });
    }
}

// Static routes first (highest crawl priority), then country pages
const allRoutes = [...staticRoutes, ...countryRoutes];

const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allRoutes.map(({ path, priority, changefreq }) => [
        '  <url>',
        `    <loc>${BASE_URL}${path}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
    ].join('\n')),
    '</urlset>',
];

const xml = xmlLines.join('\n');

const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outputPath, xml, 'utf-8');

console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`   Static pages:                  ${staticRoutes.length}`);
console.log(`   Country pages (with years):    ${countryRoutes.length}`);
console.log(`   Total URLs:                    ${allRoutes.length}`);
