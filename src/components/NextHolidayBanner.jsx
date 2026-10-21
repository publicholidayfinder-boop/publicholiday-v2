import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { countryTimezones } from '../lib/timezones';

// Build a reverse map: IANA timezone -> country code
const tzToCountry = {};
Object.entries(countryTimezones).forEach(([code, tz]) => {
    if (!tzToCountry[tz]) tzToCountry[tz] = code;
});

function detectCountryCode() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tzToCountry[tz]) return { code: tzToCountry[tz], tz };
        const region = tz.split('/')[0];
        const fallback = Object.entries(tzToCountry).find(([t]) => t.startsWith(region));
        if (fallback) return { code: fallback[1], tz };
    } catch (_) { /* ignore */ }
    return { code: 'GB', tz: 'Europe/London' };
}

function useLiveCountdown(targetDate) {
    const [diff, setDiff] = useState(null);

    useEffect(() => {
        if (!targetDate) return;
        const target = new Date(targetDate + 'T00:00:00');
        const calc = () => {
            const now = new Date();
            const msLeft = target - now;
            if (msLeft <= 0) return setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            const days    = Math.floor(msLeft / 86400000);
            const hours   = Math.floor((msLeft % 86400000) / 3600000);
            const minutes = Math.floor((msLeft % 3600000) / 60000);
            const seconds = Math.floor((msLeft % 60000) / 1000);
            setDiff({ days, hours, minutes, seconds });
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    return diff;
}

function CountUnit({ value, label }) {
    return (
        <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-black tabular-nums w-6 text-right">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-emerald-200 font-bold">{label}</span>
        </div>
    );
}

export default function NextHolidayBanner() {
    const [holiday, setHoliday] = useState(null);
    const [countryName, setCountryName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState(false);
    const countdown = useLiveCountdown(holiday?.date);

    useEffect(() => {
        const { code } = detectCountryCode();
        setCountryCode(code);
        const year = new Date().getFullYear();
        const today = new Date().toISOString().split('T')[0];

        fetch('/data/countries/' + code + '.json')
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setCountryName(data.name); })
            .catch(() => {});

        fetch('/data/holidays/' + code + '.json')
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
    }, []);

    if (dismissed || loading || !holiday || !countdown) return null;

    const isTomorrow = countdown.days === 1 && countdown.hours === 0;
    const isVerySoon = countdown.days === 0;

    const formattedDate = new Date(holiday.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
    });

    return (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white print:hidden">
            <div className="container mx-auto px-4 py-2.5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 hidden sm:block">
                            Next Holiday
                        </span>
                        {isVerySoon && (
                            <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                                Today!
                            </span>
                        )}
                        {isTomorrow && !isVerySoon && (
                            <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                Tomorrow
                            </span>
                        )}
                    </div>

                    <Link
                        to={'/country/' + countryCode + '/' + new Date(holiday.date).getFullYear()}
                        className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-90 transition-opacity"
                    >
                        <span className="font-bold text-sm truncate">{holiday.name}</span>
                        <span className="text-emerald-200 text-xs flex-shrink-0 hidden md:block">
                            {countryName ? 'in ' + countryName : ''} · {formattedDate}
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                            {countdown.days > 0 && <CountUnit value={countdown.days} label="d" />}
                            <CountUnit value={countdown.hours} label="h" />
                            <CountUnit value={countdown.minutes} label="m" />
                            <CountUnit value={countdown.seconds} label="s" />
                        </div>
                        <button
                            onClick={() => setDismissed(true)}
                            className="ml-1 w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                            aria-label="Dismiss"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
