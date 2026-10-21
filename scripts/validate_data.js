import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../public/data');

// 1. Define Schemas
const countriesListSchema = z.array(
    z.object({
        id: z.string().length(2),
        name: z.string().min(1),
        region: z.string().optional()
    })
);

const countrySchema = z.object({
    id: z.string().length(2),
    name: z.string().min(1),
    region: z.string().optional(),
    description: z.union([z.string(), z.record(z.string())]).optional(),
    sections: z.array(
        z.object({
            title: z.union([z.string().min(1), z.record(z.string())]),
            content: z.union([z.string(), z.record(z.string())]).optional(),
            items: z.array(
                z.object({
                    q: z.union([z.string().min(1), z.record(z.string())]),
                    a: z.union([z.string().min(1), z.record(z.string())])
                })
            ).optional()
        })
    ).optional()
});

const holidaySchema = z.object({
    id: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
    name: z.string().min(1),
    localName: z.string().optional(),
    isPublicHoliday: z.boolean().optional()
});

const holidaysFileSchema = z.array(holidaySchema);

function runValidation() {
    console.log('Starting data validation...');
    let hasErrors = false;

    // Validate countries.json
    try {
        const countriesFile = path.join(dataPath, 'countries.json');
        if (fs.existsSync(countriesFile)) {
            const data = JSON.parse(fs.readFileSync(countriesFile, 'utf8'));
            countriesListSchema.parse(data);
            console.log('✅ countries.json is valid.');
        } else {
            console.warn('⚠️ countries.json not found.');
        }
    } catch (e) {
        console.error('❌ Validation failed for countries.json:');
        console.error(e.issues);
        hasErrors = true;
    }

    // Validate individual country files
    const countriesDir = path.join(dataPath, 'countries');
    if (fs.existsSync(countriesDir)) {
        const files = fs.readdirSync(countriesDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const filePath = path.join(countriesDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                countrySchema.parse(data);
            } catch (e) {
                console.error(`❌ Validation failed for ${file}:`);
                console.error(e.issues);
                hasErrors = true;
            }
        }
        console.log(`✅ Validated ${files.length} country profile files.`);
    }

    // Validate individual holiday files
    const holidaysDir = path.join(dataPath, 'holidays');
    if (fs.existsSync(holidaysDir)) {
        const files = fs.readdirSync(holidaysDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const filePath = path.join(holidaysDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                holidaysFileSchema.parse(data);
            } catch (e) {
                console.error(`❌ Validation failed for ${file}:`);
                console.error(e.issues);
                hasErrors = true;
            }
        }
        console.log(`✅ Validated ${files.length} holiday calendar files.`);
    }

    if (hasErrors) {
        console.error('💥 Validation completed with errors. See output above.');
        process.exit(1);
    } else {
        console.log('🚀 All data files passed validation successfully!');
    }
}

runValidation();
