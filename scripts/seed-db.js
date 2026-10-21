import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read holidays data
const dataPath = path.join(__dirname, '../src/data/holidays.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const { countries, holidays } = JSON.parse(rawData);

// Check if Firebase config is present
if (!process.env.VITE_FIREBASE_API_KEY) {
    console.error('❌ Error: Firebase configuration not found in .env file.');
    console.log('Please add your Firebase credentials to the .env file first.');
    process.exit(1);
}

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
    console.log('🚀 Starting data seeding...');

    try {
        // Seed Countries
        console.log(`📦 Seeding ${countries.length} countries...`);
        const countryBatch = writeBatch(db);

        countries.forEach(country => {
            const ref = doc(db, 'countries', country.id);
            countryBatch.set(ref, {
                ...country,
                createdAt: new Date()
            });
        });

        await countryBatch.commit();
        console.log('✅ Countries seeded successfully');

        // Seed Holidays
        console.log(`📦 Seeding ${holidays.length} holidays...`);
        // Process holidays in chunks of 500 (Firestore batch limit)
        const chunkSize = 500;
        for (let i = 0; i < holidays.length; i += chunkSize) {
            const chunk = holidays.slice(i, i + chunkSize);
            const batch = writeBatch(db);

            chunk.forEach(holiday => {
                // Create a proper date object from the date string
                const holidayData = {
                    ...holiday,
                    date: new Date(holiday.date), // Convert string "2026-03-06" to Date object
                    createdAt: new Date()
                };

                // Remove id from data if we want Firestore to generate it, 
                // or use the id as the document key.
                // using the JSON id as document key for consistency
                const ref = doc(db, 'holidays', holiday.id);
                batch.set(ref, holidayData);
            });

            await batch.commit();
            console.log(`   - Batch ${Math.floor(i / chunkSize) + 1} committed`);
        }

        console.log('✅ Holidays seeded successfully');
        console.log('🎉 Database population complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
