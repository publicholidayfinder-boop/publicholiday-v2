import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCountry, useHolidays } from '../hooks/useHolidays';
import { useTranslation } from 'react-i18next';
import FlagImage from '../components/FlagImage';
import SEO from '../components/SEO';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES_SHORT = ['Mo','Tu','We','Th','Fr','Sa','Su'];

function MonthGrid({ year, monthIndex, holidayMap }) {
    const firstDay = new Date(year, monthIndex, 1);
    const startDow = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return (
        <div className="month-grid">
            <div className="month-title">{MONTH_NAMES[monthIndex]}</div>
            <div className="day-headers">
                {DAY_NAMES_SHORT.map(d => <div key={d} className="day-header">{d}</div>)}
            </div>
            <div className="day-cells">
                {cells.map((day, i) => {
                    if (!day) return <div key={i} className="day-cell empty" />;
                    const dateStr = year + '-' + String(monthIndex+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
                    const holiday = holidayMap[dateStr];
                    const isToday = dateStr === todayStr;
                    const dow = (new Date(year, monthIndex, day).getDay() + 6) % 7;
                    const isWeekend = dow >= 5;
                    let cellClass = 'day-cell';
                    if (holiday) cellClass += ' holiday-cell';
                    else if (isWeekend) cellClass += ' weekend-cell';
                    if (isToday) cellClass += ' today-cell';
                    return (
                        <div key={i} className={cellClass} title={holiday ? holiday.name : ''}>
                            <span className="day-num">{day}</span>
                            {holiday && <span className="holiday-name">{holiday.name}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const PLANNER_STYLES = `
    @media print {
        body * { visibility: hidden; }
        #year-planner, #year-planner * { visibility: visible; }
        #year-planner { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
        @page { size: A4 landscape; margin: 8mm; }
    }
    .planner-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    @media (max-width: 900px) { .planner-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 500px) { .planner-grid { grid-template-columns: 1fr; } }
    .month-grid { background: white; border-radius: 8px; border: 1px solid #e2e8f0; padding: 8px; }
    .month-title { font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #059669; margin-bottom: 4px; }
    .day-headers { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 2px; }
    .day-header { text-align: center; font-size: 8px; font-weight: 700; color: #94a3b8; padding: 2px 0; }
    .day-cells { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
    .day-cell { min-height: 26px; padding: 2px; border-radius: 3px; display: flex; flex-direction: column; align-items: center; }
    .weekend-cell .day-num { color: #94a3b8; }
    .today-cell .day-num { background: #059669; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
    .holiday-cell { background: #d1fae5; }
    .holiday-cell .day-num { color: #065f46; font-weight: 800; }
    .day-num { font-size: 9px; font-weight: 600; color: #334155; line-height: 1; }
    .holiday-name { font-size: 6px; color: #065f46; font-weight: 700; text-align: center; line-height: 1.1; margin-top: 1px; max-height: 16px; overflow: hidden; word-break: break-word; }
`;

export default function YearPlannerPage() {
    const { countryCode, year } = useParams();
    const { i18n } = useTranslation();
    const { country } = useCountry(countryCode, i18n.language);
    const { holidays, loading } = useHolidays(countryCode, year);
    const yearInt = parseInt(year);

    const holidayMap = useMemo(() => {
        if (!holidays) return {};
        const map = {};
        holidays
            .filter(h => h.year === yearInt && (h.isPublicHoliday || h.type === 'public'))
            .forEach(h => { if (!map[h.date]) map[h.date] = h; });
        return map;
    }, [holidays, yearInt]);

    const publicCount = Object.keys(holidayMap).length;

    return (
        <>
            <SEO
                title={`${year} Year Planner - ${country?.name || countryCode} | PublicHolidayFinder`}
                description={`Printable ${year} year planner with all public holidays for ${country?.name || countryCode}.`}
            />
            <style>{PLANNER_STYLES}</style>
            <div className="min-h-screen bg-slate-50">
                <div className="no-print bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 print:hidden">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link to={`/country/${countryCode}/${year}`} className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back
                            </Link>
                            {country && (
                                <div className="flex items-center gap-2">
                                    <FlagImage countryCode={countryCode} size="sm" />
                                    <span className="font-bold text-slate-800">{country.name} {year} Year Planner</span>
                                    <span className="text-slate-400 text-sm">{publicCount} public holidays</span>
                                </div>
                            )}
                        </div>
                        <button onClick={() => window.print()} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg shadow-sm transition-all text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Print / Save as PDF
                        </button>
                    </div>
                </div>
                <div id="year-planner" className="container mx-auto px-4 py-6 max-w-6xl">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            {country && <FlagImage countryCode={countryCode} size="xl" className="rounded" />}
                            <div>
                                <h1 className="text-xl font-black text-slate-900">{country?.name || countryCode} &mdash; {year} Public Holiday Year Planner</h1>
                                <p className="text-slate-400 text-xs mt-0.5">{publicCount} public holidays highlighted &middot; PublicHolidayFinder.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600 no-print">
                            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 inline-block"></span> Public Holiday</span>
                            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-white border border-slate-200 inline-block text-slate-400 text-[8px] flex items-center justify-center">Sa</span> Weekend</span>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center py-20 text-slate-400">
                            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
                            Loading planner...
                        </div>
                    ) : (
                        <div className="planner-grid">
                            {Array.from({ length: 12 }, (_, i) => (
                                <MonthGrid key={i} year={yearInt} monthIndex={i} holidayMap={holidayMap} />
                            ))}
                        </div>
                    )}
                    <div className="mt-5 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                        PublicHolidayFinder.com &middot; {year} {country?.name} Public Holiday Year Planner &middot; Data for informational purposes only
                    </div>
                </div>
            </div>
        </>
    );
}