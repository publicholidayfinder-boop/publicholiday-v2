import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import FlagImage from '../components/FlagImage';
import { useCountry, useHolidays } from '../hooks/useHolidays';
import { getTimezone, getUtcOffset, multiTimezoneCountries } from '../lib/timezones';

function getWorkingDaysInRange(startDate, endDate, holidaySet) {
    let count = 0;
    const cursor = new Date(startDate);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
        const day = cursor.getDay();
        const isWeekend = day === 0 || day === 6;
        const dateStr = cursor.toISOString().slice(0, 10);
        const isHoliday = holidaySet.has(dateStr);
        if (!isWeekend && !isHoliday) count++;
        cursor.setDate(cursor.getDate() + 1);
    }
    return count;
}

function monthLabel(year, month) {
    return new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export default function WorkingDaysPage() {
    const { countryCode } = useParams();
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d.toISOString().slice(0, 10);
    });
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        d.setDate(0);
        return d.toISOString().slice(0, 10);
    });

    const { country } = useCountry(countryCode);
    const { holidays } = useHolidays(countryCode, selectedYear);

    // Build a Set of public holiday date strings for fast lookup
    const holidaySet = useMemo(() => {
        const s = new Set();
        if (!holidays) return s;
        holidays.forEach(h => {
            if (h.isPublicHoliday) {
                const dateStr = typeof h.date === 'string' ? h.date.slice(0, 10) : new Date(h.date).toISOString().slice(0, 10);
                s.add(dateStr);
            }
        });
        return s;
    }, [holidays]);

    // Working days in custom range
    const customWorkingDays = useMemo(() => {
        if (!startDate || !endDate) return null;
        return getWorkingDaysInRange(new Date(startDate), new Date(endDate), holidaySet);
    }, [startDate, endDate, holidaySet]);

    // Monthly breakdown for the selected year
    const monthlyBreakdown = useMemo(() => {
        return Array.from({ length: 12 }, (_, m) => {
            const totalDays = daysInMonth(selectedYear, m);
            const monthStart = new Date(selectedYear, m, 1);
            const monthEnd = new Date(selectedYear, m, totalDays);
            const working = getWorkingDaysInRange(monthStart, monthEnd, holidaySet);
            const holidaysInMonth = holidays
                ? holidays.filter(h => {
                    const d = new Date(h.date);
                    return d.getMonth() === m && d.getFullYear() === selectedYear && h.isPublicHoliday;
                })
                : [];
            return { month: m, label: monthLabel(selectedYear, m), totalDays, working, holidays: holidaysInMonth };
        });
    }, [selectedYear, holidaySet, holidays]);

    const timezone = getTimezone(countryCode);
    const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear - 1 + i);

    const countryName = country?.name || countryCode;

    return (
        <>
            <SEO
                title={`Working Days in ${countryName} ${selectedYear} — Business Day Calculator`}
                description={`Calculate working and business days in ${countryName} for ${selectedYear}, excluding weekends and public holidays. Monthly breakdown included.`}
                keywords={`working days ${countryName} ${selectedYear}, business days calculator ${countryName}, how many working days ${countryName}`}
                canonical={`https://publicholidayfinder.com/working-days/${countryCode}`}
            />

            <div className="container mx-auto px-4 py-8 max-w-5xl">

                {/* Breadcrumbs */}
                <nav className="text-xs font-medium text-slate-500 flex items-center gap-2 mb-6">
                    <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to={`/country/${countryCode}/${selectedYear}`} className="hover:text-emerald-700 transition-colors">{countryName}</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold">Working Days</span>
                </nav>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <FlagImage countryCode={countryCode} size="2xl" className="rounded-md flex-shrink-0" />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 leading-tight">
                            Working Days in {countryName}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Business days calculator excluding weekends & public holidays
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT — Calculator + Monthly Table */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Custom Range Calculator */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-sm">⏱</span>
                                Calculate Working Days in a Date Range
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400 transition-colors"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400 transition-colors"
                                    />
                                </div>
                            </div>
                            {customWorkingDays !== null && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
                                    <div className="text-5xl font-black text-emerald-600 leading-none">{customWorkingDays}</div>
                                    <div>
                                        <div className="font-bold text-slate-900">working days</div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            {startDate} → {endDate} · Excludes weekends &amp; public holidays
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Year selector + Monthly Breakdown */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-bold text-slate-900">Monthly Breakdown — {selectedYear}</h2>
                                <select
                                    value={selectedYear}
                                    onChange={e => setSelectedYear(Number(e.target.value))}
                                    className="appearance-none pl-3 pr-7 py-1.5 bg-white text-slate-800 font-bold rounded-lg text-xs border border-slate-200 hover:border-emerald-300 outline-none cursor-pointer transition-colors shadow-sm"
                                >
                                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/75 border-b border-slate-100">
                                            <th className="py-3 px-4">Month</th>
                                            <th className="py-3 px-4 text-center">Total Days</th>
                                            <th className="py-3 px-4 text-center">Public Holidays</th>
                                            <th className="py-3 px-4 text-center font-extrabold text-emerald-700">Working Days</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {monthlyBreakdown.map(row => (
                                            <tr key={row.month} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3 px-4 font-semibold text-slate-800">{row.label}</td>
                                                <td className="py-3 px-4 text-center text-slate-600">{row.totalDays}</td>
                                                <td className="py-3 px-4 text-center">
                                                    {row.holidays.length > 0 ? (
                                                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                                                            <span className="w-4 h-4 bg-rose-100 rounded text-[10px] flex items-center justify-center font-black">{row.holidays.length}</span>
                                                            <span className="text-xs hidden sm:inline truncate max-w-[120px]">{row.holidays[0].name}{row.holidays.length > 1 ? ` +${row.holidays.length - 1}` : ''}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">None</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-emerald-700 font-black text-base">{row.working}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50 font-black border-t-2 border-slate-200">
                                            <td className="py-3 px-4 text-slate-900">Total {selectedYear}</td>
                                            <td className="py-3 px-4 text-center text-slate-700">{monthlyBreakdown.reduce((s, r) => s + r.totalDays, 0)}</td>
                                            <td className="py-3 px-4 text-center text-rose-700">{monthlyBreakdown.reduce((s, r) => s + r.holidays.length, 0)}</td>
                                            <td className="py-3 px-4 text-center text-emerald-700 text-lg">{monthlyBreakdown.reduce((s, r) => s + r.working, 0)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Related tools sidebar */}
                    <div className="flex flex-col gap-4">

                        {/* Related Tools */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                            <h3 className="font-bold text-slate-900 text-sm mb-4">Related Tools for {countryName}</h3>
                            <div className="flex flex-col gap-2">
                                <Link
                                    to={`/country/${countryCode}/${selectedYear}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all group"
                                >
                                    <span className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📅</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">{selectedYear} Public Holidays</div>
                                        <div className="text-[10px] text-slate-500">View all official holidays</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/country/${countryCode}/${selectedYear + 1}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
                                >
                                    <span className="w-9 h-9 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📆</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">{selectedYear + 1} Public Holidays</div>
                                        <div className="text-[10px] text-slate-500">Plan ahead for next year</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/time/${countryCode}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 border border-transparent hover:border-violet-200 transition-all group"
                                >
                                    <span className="w-9 h-9 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">🕐</span>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-violet-700">Current Time in {countryName}</div>
                                        <div className="text-[10px] text-slate-500">Live clock &amp; timezone info</div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/calendar-generator?country=${countryCode}&year=${selectedYear}`}
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

                        {/* Info card */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">How it's calculated</h3>
                            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                                <li className="flex gap-2"><span className="text-emerald-600 font-bold mt-0.5">✓</span> Weekdays Monday–Friday are counted</li>
                                <li className="flex gap-2"><span className="text-rose-500 font-bold mt-0.5">✗</span> Saturdays &amp; Sundays excluded</li>
                                <li className="flex gap-2"><span className="text-rose-500 font-bold mt-0.5">✗</span> Official public holidays excluded</li>
                                <li className="flex gap-2"><span className="text-slate-400 font-bold mt-0.5">ℹ</span> Observances are NOT excluded</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
