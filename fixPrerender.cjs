const fs = require('fs');
let content = fs.readFileSync('scripts/prerender.js', 'utf8');

content = content.replace(
    /const browser = await puppeteer.launch\(\{ headless: 'new' \}\);\s*const page = await browser.newPage\(\);/,
    "let browser = await puppeteer.launch({ headless: 'new' });\n        let page = await browser.newPage();"
);

const loopTarget = `for (const route of routes) {
            console.log(\`Prerendering \${route} ...\`);
            await page.goto(\`http://127.0.0.1:3000\${route}\`, { waitUntil: 'networkidle2' });

            // Extract the fully rendered HTML
            const html = await page.content();

            // Determine output path
            const routePath = route === '/' ? '/index.html' : \`\${route}/index.html\`;
            const fullPath = path.join(distPath, routePath);

            // Ensure the directory exists
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });

            // Save the HTML
            fs.writeFileSync(fullPath, html);
        }`;

const loopReplacement = `let count = 0;
        for (const route of routes) {
            if (count > 0 && count % 50 === 0) {
                await browser.close();
                browser = await puppeteer.launch({ headless: 'new' });
                page = await browser.newPage();
            }
            count++;
            
            console.log(\`Prerendering \${route} ...\`);
            await page.goto(\`http://127.0.0.1:3000\${route}\`, { waitUntil: 'networkidle2' });

            const html = await page.content();

            const routePath = route === '/' ? '/index.html' : \`\${route}/index.html\`;
            const fullPath = path.join(distPath, routePath);

            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, html);
            
            await page.goto('about:blank');
        }`;

content = content.replace(loopTarget, loopReplacement);
fs.writeFileSync('scripts/prerender.js', content, 'utf8');
console.log('Updated prerender.js');
