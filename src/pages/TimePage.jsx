import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import FlagImage from '../components/FlagImage';
import { useCountry, useHolidays } from '../hooks/useHolidays';
import { getTimezone, getUtcOffset, multiTimezoneCountries } from '../lib/timezones';

function useLiveClock(timezone) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const formatted = useMemo(() => {
        try {
            return {
                time: now.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
                date: now.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                timeShort: now.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false }),
            };
        } catch {
            return { time: '--:--:--', date: '---', timeShort: '--:--' };
        }
    }, [now, timezone]);

    return formatted;
}

export default function TimePage() {
    const { countryCode } = useParams();
    const currentYear = new Date().getFullYear();

    const { country } = useCountry(countryCode);
    const { holidays } = useHolidays(countryCode, currentYear);
    
    const defaultTimezone = useMemo(() => getTimezone(countryCode), [countryCode]);
    const [selectedTimezone, setSelectedTimezone] = useState(defaultTimezone);

    // Reset timezone if country changes
    useEffect(() => {
        setSelectedTimezone(getTimezone(countryCode));
    }, [countryCode]);

    const timezone = selectedTimezone || defaultTimezone;
    const utcOffset = useMemo(() => getUtcOffset(timezone), [timezone]);
    const multiZones = multiTimezoneCountries[countryCode] || null;
    const clock = useLiveClock(timezone);
    const countryName = country?.name || countryCode;

    // Next upcoming holiday
    const nextHoliday = useMemo(() => {
        if (!holidays || holidays.length === 0) return null;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const upcoming = holidays
            .map(h => ({ ...h, d: new Date(h.date) }))
            .filter(h => !isNaN(h.d.getTime()) && h.d >= now && h.isPublicHoliday)
            .sort((a, b) => a.d - b.d);
        if (!upcoming.length) return null;
        const days = Math.ceil((upcoming[0].d - now) / 86400000);
        return { ...upcoming[0], daysToGo: days };
    }, [holidays]);

    // DST detection
    const hasDST = useMemo(() => {
        try {
            const jan = new Date(currentYear, 0, 1);
            const jul = new Date(currentYear, 6, 1);
            const janOffset = new Intl.DateTimeFormat('en', { timeZone: timezone, timeZoneName: 'shortOffset' })
                .formatToParts(jan).find(p => p.type === 'timeZoneName')?.value;
            const julOffset = new Intl.DateTimeFormat('en', { timeZone: timezone, timeZoneName: 'shortOffset' })
                .formatToParts(jul).find(p => p.type === 'timeZoneName')?.value;
            return janOffset !== julOffset;
        } catch {
            return false;
        }
    }, [timezone, currentYear]);

    return (
        <>
            <SEO
                title={`Current Time in ${countryName} — Live Clock & Timezone`}
                description={`What time is it in ${countryName} right now? Live local time, UTC offset, timezone (${timezone}), and DST information for ${countryName}.`}
                keywords={`current time ${countryName}, what time is it in ${countryName}, ${countryName} timezone, ${countryName} time zone, ${countryCode} local time`}
                canonical={`https://publicholidayfinder.com/time/${countryCode}`}
            />

            <div className="container mx-auto px-4 py-8 max-w-5xl">

                {/* Breadcrumbs */}
                <nav className="text-xs font-medium text-slate-500 flex items-center gap-2 mb-6">
                    <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to={`/country/${countryCode}/${currentYear}`} className="hover:text-emerald-700 transition-colors">{countryName}</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold">Current Time</span>
                </nav>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <FlagImage countryCode={countryCode} size="2xl" className="rounded-md flex-shrink-0" />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 leading-tight">
                            Current Time in {countryName}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Live clock · {timezone} · {utcOffset}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT — Clock + Info */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Live Clock Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 text-center">
                            <div className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-3">
                                {countryName} Local Time
                            </div>
                            <div className="text-6xl sm:text-7xl font-black text-white tabular-nums tracking-tight leading-none mb-2">
                                {clock.time}
                            </div>
                            <div className="text-slate-300 text-base mt-3">
                                {clock.date}
                            </div>
                            <div className="flex items-center justify-center gap-3 mt-4">
                                <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-semibold">
                                    {utcOffset}
                                </span>
                                {hasDST && (
                                    <span className="text-xs bg-amber-900/60 text-amber-300 px-3 py-1 rounded-full font-semibold">
                                        DST observed
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Timezone Details */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                            <h2 className="text-base font-bold text-slate-900 mb-4">Timezone Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Timezone Name</div>
                                    <div className="font-semibold text-slate-900 text-sm">{timezone}</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">UTC Offset</div>
                                    <div className="font-semibold text-slate-900 text-sm">{utcOffset}</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Daylight Saving Time</div>
                                    <div className="font-semibold text-slate-900 text-sm">{hasDST ? '✓ Observed' : '✗ Not observed'}</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Your Local Comparison</div>
                                    <div className="font-semibold text-slate-900 text-sm">
                                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} (your time)
                                    </div>
                                </div>
                            </div>

                            {/* Multi-timezone note */}
                            {multiZones && (
                                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <div className="text-xs font-bold text-slate-700 mb-3">📍 {countryName} spans multiple timezones. Select one to view:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {multiZones.map((z, i) => {
                                            const isActive = timezone === z.tz;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedTimezone(z.tz)}
                                                    className={`text-xs px-3 py-1.5 rounded-full transition-all border ${isActive ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50'}`}
                                                >
                                                    {z.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-3">
                                        {timezone === defaultTimezone ? 'Showing primary / capital timezone by default.' : 'Showing selected custom timezone.'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Next Holiday Countdown */}
                        {nextHoliday && (
                            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6">
                                <h2 className="text-base font-bold text-slate-900 mb-3">Next Public Holiday in {countryName}</h2>
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl font-black text-emerald-600 leading-none">{nextHoliday.daysToGo}</div>
                                    <div>
                                        <div className="text-xs text-slate-500">days until</div>
                                        <div className="font-bold text-slate-900">{nextHoliday.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{new Date(nextHoliday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                    </div>
                                </div>
                                <Link
                                    to={`/country/${countryCode}/${currentYear}`}
                                    className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                                >
                                    View all {currentYear} public holidays →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Related Tools */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                            <h3 className="font-bold text-slate-900 text-sm mb-4">Related Tools for {countryName}</h3>
                            <div className="flex flex-col gap-2">
                                <Link
                                    to={`/country/${countryCode}/${currentYear}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all group"
                                >
                                    <span className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📅</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">{currentYear} Public Holidays</div>
                                        <div className="text-[10px] text-slate-500">View all official holidays</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/country/${countryCode}/${currentYear + 1}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
                                >
                                    <span className="w-9 h-9 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📆</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">{currentYear + 1} Public Holidays</div>
                                        <div className="text-[10px] text-slate-500">Plan ahead for next year</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/working-days/${countryCode}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all group"
                                >
                                    <span className="w-9 h-9 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">⏱</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-amber-700">Working Days Calculator</div>
                                        <div className="text-[10px] text-slate-500">Count business days</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/calendar-generator?country=${countryCode}&year=${currentYear}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all group"
                                >
                                    <span className="w-9 h-9 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📄</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-rose-700">Printable Calendar</div>
                                        <div className="text-[10px] text-slate-500">PDF &amp; PNG download</div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Fun world clock note */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Your time vs {countryName}</div>
                            <div className="space-y-2 text-xs text-slate-700">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Your local time</span>
                                    <span className="font-bold tabular-nums">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{countryName}</span>
                                    <span className="font-bold tabular-nums text-emerald-700">{clock.timeShort}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
