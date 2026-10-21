const fs = require('fs');

const component = `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import FlagImage from './FlagImage';

function WatchlistCard({ countryCode, year, today }) {
    const [holiday, setHoliday] = useState(null);
    const [countryName, setCountryName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/countries/' + countryCode + '.json')
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setCountryName(data.name); })
            .catch(() => {});

        fetch('/data/holidays/' + countryCode + '.json')
            .then(r => r.ok ? r.json() : [])
            .then(holidays => {
                const thisYear = holidays.filter(h => h.date >= today && h.year === year);
                const nextYear = holidays.filter(h => h.year === year + 1);
                const all = [...thisYear, ...nextYear].sort((a, b) => a.date.localeCompare(b.date));
                const next = all.find(h => h.isPublicHoliday || h.type === 'public' || h.type === 'National');
                setHoliday(next || all[0] || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [countryCode, year, today]);

    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse flex flex-col gap-3">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-100 rounded w-3/4"></div>
            </div>
        );
    }

    if (!holiday) return null;

    const formattedDate = new Date(holiday.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
    });

    const isToday = holiday.date === today;
    const isTomorrow = new Date(new Date(today).getTime() + 86400000).toISOString().split('T')[0] === holiday.date;

    return (
        <Link 
            to={'/country/' + countryCode + '/' + new Date(holiday.date).getFullYear()}
            className="group bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-2 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <FlagImage countryCode={countryCode} size="sm" className="rounded" />
                    <span className="font-bold text-sm text-slate-800">{countryName || countryCode}</span>
                </div>
                {isToday && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Today</span>}
                {isTomorrow && <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Tomorrow</span>}
            </div>
            <div>
                <div className="font-semibold text-emerald-700 text-sm truncate">{holiday.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{formattedDate}</div>
            </div>
        </Link>
    );
}

export default function PersonalWatchlist() {
    const { watchlist } = useWatchlist();
    const year = new Date().getFullYear();
    const today = new Date().toISOString().split('T')[0];

    if (!watchlist || watchlist.length === 0) return null;

    return (
        <section className="bg-amber-50/50 py-6 border-b border-amber-100">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Your Watchlist</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {watchlist.map(code => (
                        <WatchlistCard key={code} countryCode={code} year={year} today={today} />
                    ))}
                </div>
            </div>
        </section>
    );
}
`;

fs.writeFileSync('src/components/PersonalWatchlist.jsx', component, 'utf-8');
console.log('Created PersonalWatchlist component.');
