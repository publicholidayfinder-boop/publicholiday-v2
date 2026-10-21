const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// 1. Add import for useWatchlist
const importIdx = lines.findIndex(l => l.includes('import FlagImage'));
lines.splice(importIdx, 0, "import { useWatchlist } from '../hooks/useWatchlist';");

// 2. Add hook usage inside CountryPage component
const compStart = lines.findIndex(l => l.includes('export default function CountryPage() {'));
lines.splice(compStart + 5, 0, "    const { toggleCountry, isPinned, isFull } = useWatchlist();", "    const pinned = isPinned(countryCode);");

// 3. Add Watchlist button in the action bar
const shareIdx = lines.findIndex(l => l.includes('Year Planner')) + 2;

const watchlistBtn = [
    '                            <button',
    '                                onClick={() => {',
    '                                    if (!pinned && isFull) {',
    '                                        alert("Watchlist is full! You can only pin up to 5 countries.");',
    '                                        return;',
    '                                    }',
    '                                    toggleCountry(countryCode);',
    '                                }}',
    '                                className={`flex items-center gap-1.5 bg-white border text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all ${',
    '                                    pinned ? "border-amber-400 text-amber-700 bg-amber-50" : "border-slate-300 text-slate-700 hover:bg-slate-50"',
    '                                }`}',
    '                                title={pinned ? "Remove from Watchlist" : "Add to Watchlist"}',
    '                            >',
    '                                <svg className={`w-3 h-3 ${pinned ? "fill-amber-400 text-amber-500" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>',
    '                                {pinned ? "Saved" : "Save"}',
    '                            </button>'
];

lines.splice(shareIdx, 0, ...watchlistBtn);

fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Added Watchlist button to CountryPage.');
