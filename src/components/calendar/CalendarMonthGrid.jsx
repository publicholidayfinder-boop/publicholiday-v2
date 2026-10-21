import React from 'react';
import { templatesConfig, getEffectiveHolidayType } from '../../lib/calendarConstants';

// Per-type overrides for religious holidays
const RELIGIOUS_TYPES = {
    Christian: { icon: '✝' },
    Islamic:   { icon: '☪' },
};


export default function CalendarMonthGrid({
    year,
    currentMonth,
    days,
    getHolidaysForDate,
    getPersonalEventsForDate,
    showWeekends,
    template,
    themeColor,
    weekStart = 0,
    holidaysLoading = false
}) {
    const tStyles = templatesConfig[template] || templatesConfig.minimal;
    
    // today reference for highlight
    const todayStr = (() => {
        const t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
    })();

    const baseDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shiftedDays = [...baseDays.slice(weekStart), ...baseDays.slice(0, weekStart)];

    // Gather holidays and events for side annotation
    const monthHolidays = [];
    const monthPersonalEvents = [];
    
    days.forEach(day => {
        if (day.isCurrentMonth) {
            const hEvents = getHolidaysForDate(day.date);
            hEvents.forEach(h => monthHolidays.push({ ...h, date: day.date }));
            
            const pEvents = getPersonalEventsForDate(day.date);
            pEvents.forEach(p => monthPersonalEvents.push({ ...p, date: day.date }));
        }
    });

    return (
        <div className="flex-1 flex gap-4 min-h-0">
            {/* Left side: Calendar Grid */}
            <div className="flex-1 flex flex-col justify-between" role="grid" aria-label="Monthly Calendar View">
                {/* Weekday headers row */}
                <div className="grid grid-cols-7 gap-px mb-1 bg-slate-100 rounded-lg p-1" role="row">
                    {shiftedDays.map((name, i) => {
                        const originalIdx = (i + weekStart) % 7;
                        const isHeaderWeekend = originalIdx === 0 || originalIdx === 6;
                        return (
                            <div 
                                key={i} 
                                role="columnheader"
                                aria-label={name}
                                className={`text-center py-2 text-xs font-bold uppercase tracking-wider`}
                                style={{ 
                                    color: isHeaderWeekend ? '#e11d48' : template === 'dark' ? '#cbd5e1' : '#334155' 
                                }}
                            >
                                {name.substring(0, 3)}
                            </div>
                        );
                    })}
                </div>
                
                {/* Days grid rendering */}
                <div 
                    className={`flex-1 grid grid-cols-7 grid-rows-6 gap-px ${template === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}
                    role="rowgroup"
                >
                    {days.map((day, idx) => {
                        const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
                        const hEvents = getHolidaysForDate(day.date);
                        const pEvents = getPersonalEventsForDate(day.date);
                        const cellDateStr = `${day.date.getFullYear()}-${String(day.date.getMonth()+1).padStart(2,'0')}-${String(day.date.getDate()).padStart(2,'0')}`;
                        const isToday = day.isCurrentMonth && cellDateStr === todayStr;
                        
                        let cellClass = `p-2 flex flex-col justify-start transition-colors min-h-[70px] ${tStyles.dayCell} `;
                        
                        let cellStyle = {};
                        if (!day.isCurrentMonth) {
                            cellClass += "bg-slate-50/40 text-slate-400 opacity-60 ";
                        } else {
                            cellClass += `${tStyles.text} `;
                            if (isWeekend && showWeekends) {
                                cellClass += `${tStyles.weekendCell} `;
                            } else {
                                cellClass += "bg-white ";
                            }
                            if (isToday) {
                                cellStyle = { border: `2.5px solid ${themeColor}` };
                            }
                        }
                        
                        const cellAriaLabel = `${day.date.toLocaleString('default', { month: 'long' })} ${day.date.getDate()}, ${day.date.getFullYear()}${isToday ? ' (Today)' : ''}`;

                        return (
                            <div 
                                key={idx} 
                                className={cellClass}
                                style={cellStyle}
                                role="gridcell"
                                aria-label={cellAriaLabel}
                            >
                                <div className="flex items-start justify-between w-full relative">
                                    <div className="relative inline-flex">
                                        <span
                                            className={`text-base font-bold ${day.isCurrentMonth ? '' : 'font-normal'} ${
                                                isToday ? 'w-7 h-7 flex items-center justify-center rounded-full border-2 text-sm' : ''
                                            } ${day.isCurrentMonth && hEvents.length > 0 ? 'print:underline decoration-[1.5px] underline-offset-[2px]' : ''}
                                            }`}
                                            style={
                                                isToday ? { borderColor: themeColor, color: themeColor } 
                                                : (hEvents.length > 0 && day.isCurrentMonth ? { color: themeColor } : {})
                                            }
                                        >
                                            {day.date.getDate()}
                                            
                                        </span>
                                        
                                        {/* Superscript marker & dot approach instead of floating labels */}
                                        {day.isCurrentMonth && (hEvents.length > 0 || pEvents.length > 0) && (
                                            <div className="absolute -top-1 -right-3 flex flex-wrap max-w-[12px] gap-0.5">
                                                {hEvents.map((h, i) => {
                                                    const type = getEffectiveHolidayType(h);
                                                    let dotColor = themeColor;
                                                    if (type === 'Christian') dotColor = '#8b5cf6';
                                                    if (type === 'Islamic') dotColor = '#0d9488';
                                                    return (
                                                        <span 
                                                            key={`h-${i}`} 
                                                            className="w-1.5 h-1.5 rounded-full" 
                                                            style={{ backgroundColor: dotColor }} 
                                                            title={h.name}
                                                        />
                                                    );
                                                })}
                                                {pEvents.map((p, i) => (
                                                    <span 
                                                        key={`p-${i}`} 
                                                        className="w-1.5 h-1.5 rounded-full bg-amber-400" 
                                                        title={p.name}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {day.isCurrentMonth && isWeekend && (
                                        <span className="text-[10px] text-rose-500 uppercase tracking-widest font-bold ml-auto">WE</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1.5 text-[8px] font-semibold uppercase tracking-wider"
                     style={{ color: template === 'dark' ? '#94a3b8' : '#64748b' }}>
                    <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0" style={{ backgroundColor: themeColor }} />
                        National Holiday
                    </span>
                    <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0" style={{ backgroundColor: '#8b5cf6' }} />
                        Christian Holiday
                    </span>
                    <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0" style={{ backgroundColor: '#0d9488' }} />
                        Islamic Holiday
                    </span>
                    <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5 flex-shrink-0" />
                        Personal Event
                    </span>
                </div>
            </div>

            {/* Right side: Side Annotations */}
            <div className={`w-48 lg:w-56 flex flex-col pt-1 pb-1 border-l pl-3 ${template === 'dark' ? 'border-slate-700' : 'border-slate-200'} print:w-40`}>
                <div className={`text-[9px] font-bold uppercase tracking-wider mb-2 border-b pb-1 ${template === 'dark' ? 'text-slate-400 border-slate-700' : 'text-slate-500 border-slate-200'}`}>
                    Holidays & Events
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col gap-2">
                    {holidaysLoading ? (
                        <div className="animate-pulse flex flex-col gap-2">
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
                        </div>
                    ) : (
                        <>
                            {monthHolidays.map((h, i) => {
                                const type = getEffectiveHolidayType(h);
                                const rel = RELIGIOUS_TYPES[type];
                                let textCol = themeColor;
                                if (type === 'Christian') textCol = '#8b5cf6';
                                else if (type === 'Islamic') textCol = '#0d9488';
                                
                                return (
                                    <div key={`side-h-${i}`} className="flex items-start gap-1.5">
                                        <span className="font-bold text-[10px] min-w-[14px] text-right" style={{ color: textCol }}>
                                            {h.date.getDate()}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className={`text-[9px] font-bold leading-tight ${template === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                                                {h.name}
                                            </span>
                                            {type !== 'National' && (
                                                <span className={`text-[7px] uppercase tracking-wider ${template === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {rel ? rel.icon : ''} {type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {monthPersonalEvents.map((p, i) => (
                                <div key={`side-p-${i}`} className="flex items-start gap-1.5">
                                    <span className="font-bold text-[10px] min-w-[14px] text-right text-amber-500">
                                        {p.date.getDate()}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className={`text-[9px] font-bold leading-tight ${template === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                                            {p.name}
                                        </span>
                                        <span className={`text-[7px] uppercase tracking-wider ${template === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                            ⭐ Personal
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {monthHolidays.length === 0 && monthPersonalEvents.length === 0 && (
                                <div className={`text-[9px] italic ${template === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                                    No events this month.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

