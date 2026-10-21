/**
 * prerender.js
 * Launches a local Express server to serve the Vite dist folder, then uses
 * Puppeteer to render each route and write the resulting HTML to dist/.
 * This gives Googlebot real HTML content instead of an empty <div id="root">.
 *
 * Run via: npm run build  (called automatically at the end of the build)
 * Or standalone: node scripts/prerender.js
 */

import puppeteer from 'puppeteer';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const PORT = 3099;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Domains to block during pre-render so Firestore/Firebase don't delay rendering.
// The app falls back to local /data/*.json files when these are blocked.
const BLOCKED_DOMAINS = [
    'firestore.googleapis.com',
    'firebase.googleapis.com',
    'firebaseapp.com',
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
    'googleapis.com',
    'google-analytics.com',
    'analytics.google.com',
    'googletagmanager.com',
    'fonts.googleapis.com',    // block external fonts to speed up render
    'fonts.gstatic.com',
];

// ─── helpers ────────────────────────────────────────────────────────────────

function startServer() {
    return new Promise((resolve) => {
        const app = express();
        app.use(express.static(distPath, { index: 'index.html' }));
        app.use((_req, res) => res.sendFile(path.join(distPath, 'index.html')));
        const server = app.listen(PORT, '127.0.0.1', () => {
            console.log(`✅ Server listening on ${BASE_URL}`);
            resolve(server);
        });
    });
}

async function launchBrowser() {
    const userDataDir = path.join(__dirname, '../.puppeteer_cache');
    return puppeteer.launch({
        headless: true,
        userDataDir,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-extensions',
            '--blink-settings=imagesEnabled=false', // skip images → faster
        ],
    });
}

async function makePage(browser) {
    const page = await browser.newPage();

    // Silence noisy console/error events from the rendered page
    page.on('console', () => {});
    page.on('pageerror', () => {});

    // Block Firebase / Google APIs so the app uses its local JSON fallback
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const url = req.url();
        const blocked = BLOCKED_DOMAINS.some(d => url.includes(d));
        if (blocked) {
            req.abort();
        } else {
            req.continue();
        }
    });

    return page;
}

// ─── main ────────────────────────────────────────────────────────────────────

async function run() {
    console.log('\n🚀 Starting pre-render pipeline…');

    const server = await startServer();

    // Build route list
    const countriesFile = path.join(__dirname, '../public/data/countries.json');
    let countries = [];
    if (fs.existsSync(countriesFile)) {
        countries = JSON.parse(fs.readFileSync(countriesFile, 'utf8'));
    } else {
        console.warn('⚠️  countries.json not found — only static routes will be pre-rendered.');
    }

    const CURRENT_YEAR = new Date().getFullYear();
    const YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1]; // Only current + next year for pre-render (saves ~200 files)

    const staticRoutes = [
        '/',
        '/about',
        '/privacy',
        '/disclaimer',
        '/compare',
        '/calendar-generator',
        '/contact',
        '/terms',
    ];

    const countryRoutes = [];
    for (const c of countries) {
        for (const year of YEARS) {
            countryRoutes.push(`/country/${c.id}/${year}`);
        }
    }

    const routes = [...staticRoutes, ...countryRoutes];
    console.log(`📄 Routes: ${routes.length} (${staticRoutes.length} static + ${countryRoutes.length} country pages)`);

    console.log('🌐 Launching Puppeteer…');
    let browser = await launchBrowser();
    let page = await makePage(browser);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];

            // Recycle browser every 100 pages to avoid memory pressure
            if (i > 0 && i % 100 === 0) {
                await browser.close();
                browser = await launchBrowser();
                page = await makePage(browser);
                console.log(`  ♻️  Browser recycled at route ${i}`);
            }

            try {
                process.stdout.write(`  [${String(i + 1).padStart(4)} / ${routes.length}] ${route} … `);

                await page.goto(`${BASE_URL}${route}`, {
                    waitUntil: 'networkidle2',  // up to 2 in-flight requests allowed
                    timeout: 20_000,
                });

                // Extra settle time for React state + data fetch to complete
                await new Promise(r => setTimeout(r, 500));

                const html = await page.content();

                const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
                const fullPath = path.join(distPath, routePath);
                fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                fs.writeFileSync(fullPath, html, 'utf8');

                process.stdout.write(`✓\n`);
                successCount++;

                await page.goto('about:blank', { waitUntil: 'load', timeout: 5000 }).catch(() => {});

            } catch (err) {
                process.stdout.write(`✗ (${err.message.split('\n')[0].slice(0, 80)})\n`);
                errorCount++;
                errors.push({ route, error: err.message });
            }
        }
    } finally {
        await browser.close().catch(() => {});
        server.close();
    }

    console.log(`\n📊 Pre-render complete:`);
    console.log(`   ✅ Success: ${successCount} / ${routes.length}`);
    if (errorCount > 0) {
        console.log(`   ❌ Errors:  ${errorCount}`);
        errors.slice(0, 15).forEach(e => console.log(`      - ${e.route}: ${e.error.slice(0, 100)}`));
        if (errors.length > 15) console.log(`      … and ${errors.length - 15} more`);
    }

    const homepageFailed = errors.some(e => e.route === '/');
    process.exit(homepageFailed ? 1 : 0);
}

run().catch(err => {
    console.error('Fatal error during pre-render:', err);
    process.exit(1);
});
