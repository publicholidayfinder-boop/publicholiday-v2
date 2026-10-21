import React from 'react';
import { templatesConfig, getEffectiveHolidayType } from '../../lib/calendarConstants';

// Icons per holiday type
const HOLIDAY_ICONS = {
    Christian: { icon: '✝', label: 'Christian Holiday' },
    Islamic:   { icon: '☪', label: 'Islamic Holiday' },
};

const getHolidayStyle = (hEvents, themeColor) => {
    if (hEvents.length === 0) return null;
    
    // Sort by type priority: Islamic/Christian first, then National/other
    const sorted = [...hEvents].sort((a, b) => {
        const typeA = getEffectiveHolidayType(a);
        const typeB = getEffectiveHolidayType(b);
        if (typeA === 'National') return 1;
        if (typeB === 'National') return -1;
        return 0;
    });
    
    const primaryHoliday = sorted[0];
    const type = getEffectiveHolidayType(primaryHoliday);
    
    if (type === 'Christian') {
        return { bg: '#8b5cf6', icon: '✝' }; // Violet
    }
    if (type === 'Islamic') {
        return { bg: '#0d9488', icon: '☪' }; // Teal
    }
    return { bg: themeColor, icon: null }; // National
};

export default function CalendarYearGrid({
    year,
    getMonthDays,
    getHolidaysForDate,
    getPersonalEventsForDate,
    showWeekends,
    template,
    themeColor,
    orientation,
    weekStart = 0
}) {
    const isDark = template === 'dark';

    const renderMiniMonth = (monthIdx) => {
        const monthDate = new Date(year, monthIdx, 1);
        const monthName = monthDate.toLocaleString('default', { month: 'long' });
        const days = getMonthDays(parseInt(year), monthIdx);
        
        // today string for year-view highlight
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

        const baseHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const shiftedHeaders = [...baseHeaders.slice(weekStart), ...baseHeaders.slice(0, weekStart)];

        return (
            <div 
                key={monthIdx} 
                className={`flex flex-col h-full p-1.5 rounded-lg border shadow-sm overflow-hidden ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-800'
                }`}
                role="grid"
                aria-label={monthName}
            >
                <div className={`text-center font-bold text-[10px] mb-0.5 pb-0.5 border-b uppercase tracking-wider ${
                    isDark ? 'text-slate-200 border-slate-800' : 'text-slate-800 border-slate-100'
                }`}>
                    {monthName}
                </div>
                <div className={`grid grid-cols-7 gap-px text-[8px] font-semibold text-center mb-0.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                    {shiftedHeaders.map((d, i) => {
                        const originalIdx = (i + weekStart) % 7;
                        const isWeekendHeader = originalIdx === 0 || originalIdx === 6;
                        return (
                            <div key={i} className={isWeekendHeader ? 'text-rose-500 font-bold' : ''}>
                                {d}
                            </div>
                        );
                    })}
                </div>
                <div className="grid grid-cols-7 grid-rows-6 gap-px flex-1">
                    {days.map((day, idx) => {
                        const hEvents = getHolidaysForDate(day.date);
                        const pEvents = getPersonalEventsForDate(day.date);
                        const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
                        const cellDateStr = `${day.date.getFullYear()}-${String(day.date.getMonth()+1).padStart(2,'0')}-${String(day.date.getDate()).padStart(2,'0')}`;
                        const isToday = day.isCurrentMonth && cellDateStr === todayStr;
                        
                        let cellClass = "text-center text-[9px] rounded ";
                        let cellStyle = {};
                        
                        const holidayStyle = getHolidayStyle(hEvents, themeColor);
                        if (!day.isCurrentMonth) {
                            cellClass += isDark ? "text-slate-800 " : "text-slate-300 ";
                        } else if (isToday) {
                            cellClass += "font-black ";
                            cellStyle = { border: `1.5px solid ${themeColor}`, color: themeColor };
                        } else if (holidayStyle) {
                            cellClass += "font-bold ";
                            cellStyle = { color: holidayStyle.bg };
                        } else if (pEvents.length > 0) {
                            cellClass += "font-bold text-amber-500 ";
                        } else if (isWeekend && showWeekends) {
                            cellClass += isDark ? "bg-slate-900/40 text-slate-500 " : "bg-slate-50 text-slate-500 ";
                        } else {
                            cellClass += isDark ? "text-slate-300 " : "text-slate-700 ";
                        }
                        
                        return (
                            <div 
                                key={idx} 
                                className={`${cellClass} flex items-center justify-center relative min-h-[16px] leading-none rounded-sm`}
                                style={cellStyle}
                                title={hEvents.concat(pEvents).map(e => e.name).join(', ')}
                            >
                                <span className={`relative z-10 leading-none ${holidayStyle ? "print:underline decoration-[0.5px] underline-offset-[1px]" : ""}`}>{day.date.getDate()}</span>
                                {holidayStyle && (
                                    <span className="absolute top-[1.5px] right-[1.5px] text-[5.5px] leading-none opacity-90 z-0">
                                        {holidayStyle.icon || '●'}
                                    </span>
                                )}
                                {!holidayStyle && pEvents.length > 0 && (
                                    <span className="absolute top-[1.5px] right-[1.5px] text-[5.5px] leading-none opacity-90 z-0 text-amber-500">
                                        ●
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-grow flex flex-col min-h-0">
            <div className={`flex-grow grid gap-2 pb-1 min-h-0 ${orientation === 'portrait' ? 'grid-cols-3 grid-rows-4' : 'grid-cols-4 grid-rows-3'}`}>
                {Array.from({ length: 12 }).map((_, monthIdx) => renderMiniMonth(monthIdx))}
            </div>
            {/* Legend */}
            <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[8px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="flex items-center">
                    <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0" style={{ backgroundColor: themeColor }} />
                    National Holiday
                </span>
                <span className="flex items-center">
                    <span className="inline-flex w-2.5 h-2.5 rounded-full items-center justify-center text-white mr-1.5 flex-shrink-0" style={{ backgroundColor: '#8b5cf6' }}>
                        <span className="text-[6px] leading-none">✝</span>
                    </span>
                    Christian Holiday
                </span>
                <span className="flex items-center">
                    <span className="inline-flex w-2.5 h-2.5 rounded-full items-center justify-center text-white mr-1.5 flex-shrink-0" style={{ backgroundColor: '#0d9488' }}>
                        <span className="text-[6px] leading-none">☪</span>
                    </span>
                    Islamic Holiday
                </span>
                <span className="flex items-center">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5 flex-shrink-0" />
                    Personal Event
                </span>
            </div>
        </div>
    );
}
