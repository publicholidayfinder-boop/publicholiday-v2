import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newHolidays = [
    // --- Movable Islamic Public Holidays ---
    {
        id: "gh-eid-ul-fitr-2026",
        countryCode: "GH",
        slug: "eid-ul-fitr",
        name: "Eid-Ul-Fitr (End of Ramadan)",
        date: new Date("2026-03-20"),
        year: 2026,
        type: "Islamic",
        isPublicHoliday: true,
        description: "Eid-Ul-Fitr marks the end of the holy month of Ramadan and is a public holiday in Ghana.",
        observanceRules: "Movable Islamic public holiday based on the lunar calendar.",
        source: "Official government calendar"
    },
    {
        id: "gh-shaqq-day-2026",
        countryCode: "GH",
        slug: "shaqq-day",
        name: "Shaqq Day (Day after Eid-Ul-Fitr)",
        date: new Date("2026-03-21"),
        year: 2026,
        type: "Islamic",
        isPublicHoliday: true,
        description: "Shaqq Day is the day after Eid-Ul-Fitr and is a public holiday in Ghana.",
        observanceRules: "Movable Islamic public holiday, falls the day after Eid-Ul-Fitr.",
        source: "Official government calendar"
    },
    {
        id: "gh-eid-ul-adha-2026",
        countryCode: "GH",
        slug: "eid-ul-adha",
        name: "Eid-Ul-Adha (Feast of the Sacrifice)",
        date: new Date("2026-05-27"),
        year: 2026,
        type: "Islamic",
        isPublicHoliday: true,
        description: "Eid-Ul-Adha (Feast of the Sacrifice) is a public holiday in Ghana. Tentative date, confirmed by the Office of the Chief Imam.",
        observanceRules: "Movable Islamic public holiday based on the lunar calendar. Tentative date subject to confirmation by the Office of the Chief Imam.",
        source: "Office of the Chief Imam"
    },
    // --- Commemorative Days (Not Public Holidays) ---
    {
        id: "gh-mothers-day-2026",
        countryCode: "GH",
        slug: "mothers-day",
        name: "Mother's Day",
        date: new Date("2026-05-10"),
        year: 2026,
        type: "Observance",
        isPublicHoliday: false,
        description: "Mother's Day is a commemorative observance in Ghana celebrated on the second Sunday of May. It is not a public holiday.",
        observanceRules: "Commemorative day only. Not a public holiday.",
        source: "Official government calendar"
    },
    {
        id: "gh-fathers-day-2026",
        countryCode: "GH",
        slug: "fathers-day",
        name: "Father's Day",
        date: new Date("2026-06-21"),
        year: 2026,
        type: "Observance",
        isPublicHoliday: false,
        description: "Father's Day is a commemorative observance in Ghana celebrated on the third Sunday of June. It is not a public holiday.",
        observanceRules: "Commemorative day only. Not a public holiday.",
        source: "Official government calendar"
    }
];

// African Union Day IDs to update (change to Observance, not public holiday)
const auDayUpdates = [
    "gh-africa-union-day-2026",
    "gh-africa-union-day-2027"
];

async function uploadGhanaHolidays() {
    console.log('🚀 Uploading new Ghana holidays to Firestore...');

    try {
        // 1. Add new holiday entries
        for (const holiday of newHolidays) {
            const { id, ...data } = holiday;
            const ref = doc(db, 'holidays', id);
            await setDoc(ref, { ...data, createdAt: new Date() });
            console.log(`✅ Added: ${holiday.name} (${holiday.date.toISOString().slice(0,10)})`);
        }

        // 2. Update African Union Day to Observance (not public holiday)
        for (const auId of auDayUpdates) {
            const ref = doc(db, 'holidays', auId);
            await updateDoc(ref, {
                type: "Observance",
                isPublicHoliday: false,
                description: "African Union Day is a commemorative observance in Ghana. It is not a public holiday.",
                observanceRules: "Commemorative day only. Not a public holiday."
            });
            console.log(`✅ Updated: ${auId} → Observance (not public holiday)`);
        }

        console.log('\n🎉 All Ghana holiday updates uploaded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

uploadGhanaHolidays();
