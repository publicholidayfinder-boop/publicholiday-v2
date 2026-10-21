import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const FULL_MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// 0=Mon, 1=Tue, ..., 6=Sun
function getFirstDayOfWeek(year, month) {
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7; // Convert Sun(0) to 6, Mon(1) to 0
}

export default function MiniCalendarMatrix({ holidays = [], year = '2026', countryCode = 'GH' }) {
    const numericYear = parseInt(year, 10) || new Date().getFullYear();
    const [selectedMobileMonth, setSelectedMobileMonth] = useState(0);

    // Map holidays by "MM-DD" for fast lookup
    const holidayDatesSet = React.useMemo(() => {
        const set = new Set();
        holidays.forEach(h => {
            if (h.date) {
                const d = new Date(h.date);
                if (!isNaN(d.getTime())) {
                    const m = d.getMonth();
                    const day = d.getDate();
                    set.add(`${m}-${day}`);
                }
            }
        });
        return set;
    }, [holidays]);

    const renderMonthGrid = (mIndex) => {
        const daysInMonth = getDaysInMonth(numericYear, mIndex);
        const startDay = getFirstDayOfWeek(numericYear, mIndex);

        const cells = [];
        // Empty cells before start of month
        for (let i = 0; i < startDay; i++) {
            cells.push(<div key={`empty-${i}`} className="h-6 w-6" />);
        }

        // Days of month
        for (let d = 1; d <= daysInMonth; d++) {
            const isHoliday = holidayDatesSet.has(`${mIndex}-${d}`);
            cells.push(
                <div
                    key={`day-${d}`}
                    className={`h-6 w-6 text-[11px] font-medium flex items-center justify-center rounded-full transition-all ${
                        isHoliday
                            ? 'bg-emerald-600 text-white font-bold shadow-sm'
                            : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isHoliday ? `Public Holiday on ${d} ${FULL_MONTH_NAMES[mIndex]}` : undefined}
                >
                    {d}
                </div>
            );
        }

        return (
            <div key={mIndex} className="bg-white rounded-lg p-2.5 border border-slate-100">
                <div className="text-xs font-bold text-slate-800 text-center mb-2">
                    {MONTH_NAMES[mIndex]}
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                    {WEEKDAYS.map((w, idx) => (
                        <span key={idx} className="text-[10px] font-bold text-slate-400">
                            {w}
                        </span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 place-items-center">
                    {cells}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-display font-bold text-slate-900">
                    Calendar {year}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ● Holidays marked
                </span>
            </div>

            {/* Desktop: 6-Month Grid (Jan to Jun) */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-3 mb-5">
                {[0, 1, 2, 3, 4, 5].map(mIndex => renderMonthGrid(mIndex))}
            </div>

            {/* Mobile: Single Month Selector */}
            <div className="sm:hidden mb-5">
                <div className="mb-3">
                    <select
                        value={selectedMobileMonth}
                        onChange={(e) => setSelectedMobileMonth(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        {FULL_MONTH_NAMES.map((name, idx) => (
                            <option key={name} value={idx}>
                                {name} {year}
                            </option>
                        ))}
                    </select>
                </div>
                {renderMonthGrid(selectedMobileMonth)}
            </div>

            {/* View Full Calendar Button */}
            <Link
                to={`/calendar-generator?country=${countryCode}&year=${year}`}
                className="w-full py-2.5 px-4 text-center rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-700 font-semibold text-xs transition-all block"
            >
                View full year calendar →
            </Link>
        </div>
    );
}
