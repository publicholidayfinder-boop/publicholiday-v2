import React, { useRef, useState, useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { emojiMap, templatesConfig, fontMap, getHolidayDateString, getLocalMidnightDate, getEffectiveHolidayType } from '../../lib/calendarConstants';
import CalendarMonthGrid from './CalendarMonthGrid';
import CalendarYearGrid from './CalendarYearGrid';

export default function CalendarWorkspace({ calendarRef }) {
    const workspaceRef = useRef(null);
    const [previewScale, setPreviewScale] = useState(1);

    const {
        nextHolidayDetails,
        orientation,
        template,
        fontFamily,
        themeColor,
        logoImage,
        customTitle,
        year,
        selectedCountryCode,
        country,
        viewMode,
        currentMonth,
        setCurrentMonth,
        getMonthDays,
        getHolidaysForDate,
        getPersonalEventsForDate,
        showWeekends,
        notes,
        showDescriptions,
        holidays,
        weekStart,
        holidaysLoading
    } = useCalendar();

    // Handle workspace zoom auto-scaling
    useEffect(() => {
        const handleResize = () => {
            if (!workspaceRef.current) return;
            const parentWidth = workspaceRef.current.clientWidth - 40;
            const targetWidth = orientation === 'landscape' ? 1123 : 794;
            setPreviewScale(Math.min(parentWidth / targetWidth, 1));
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [orientation, viewMode]);

    const activeTemplate = templatesConfig[template] || templatesConfig.minimal;
    const activeFont = fontMap[fontFamily] || 'font-sans';

    // Monthly holidays for the footer descriptions
    const monthlyHolidays = viewMode === 'month' && showDescriptions ? (holidays || []).filter(h => {
        const dateStr = getHolidayDateString(h.date);
        if (!dateStr) return false;
        const [, mo] = dateStr.split('-').map(Number);
        return mo - 1 === currentMonth;
    }) : [];
    
    const visibleMonthlyHolidays = monthlyHolidays.slice(0, 6);
    const excessMonthlyHolidays = monthlyHolidays.length > 6 ? monthlyHolidays.length - 6 : 0;

    return (
        <div ref={workspaceRef} className="flex-grow p-6 overflow-auto flex flex-col items-center justify-start min-h-[500px]">
            {/* Interactive Countdown Header Widget */}
            {nextHolidayDetails && (
                <div className="mb-6 max-w-4xl w-full bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">🚀</div>
                        <div>
                            <div className="text-xs text-slate-400 font-medium">NEXT UPCOMING PUBLIC HOLIDAY</div>
                            <div className="text-white font-bold text-sm">
                                {nextHolidayDetails.holiday.name} ({new Date(nextHolidayDetails.holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">COUNTDOWN</div>
                            <div className="text-primary-400 font-black text-xl leading-none">
                                {nextHolidayDetails.daysRemaining} days left
                            </div>
                        </div>
                        <div className="bg-primary-950/50 border border-primary-500/20 text-xl font-black p-2 rounded-lg text-primary-400 leading-none">
                            ⏱️
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Canva-style paper rendering frame */}
            <div 
                className="bg-slate-800/30 border border-slate-700/50 shadow-2xl rounded-xl flex items-center justify-center p-6 print:p-0 print:border-none print:shadow-none print:bg-transparent"
                style={{ 
                    minHeight: '620px', 
                    width: '100%', 
                    maxWidth: '1200px', 
                    overflow: 'hidden' 
                }}
            >
                {/* Visual workspace scale scaler */}
                <div 
                    style={{ 
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'top center',
                        width: orientation === 'landscape' ? '1123px' : '794px',
                        height: orientation === 'landscape' ? '794px' : '1123px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    className="shadow-2xl flex-shrink-0 print:transform-none print:shadow-none print:w-full print:h-auto"
                >
                    {/* THE PRINTABLE CALENDAR CONTAINER ELEMENT */}
                    <div 
                        ref={calendarRef}
                        id="printable-calendar"
                        className={`${activeTemplate.bg} ${activeTemplate.text} ${activeFont} ${activeTemplate.border} pt-6 pb-8 px-8 flex flex-col justify-between h-full select-none relative overflow-hidden print:p-0`}
                        style={{
                            fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'playful' ? 'Outfit, sans-serif' : fontFamily === 'monospace' ? 'Courier, monospace' : 'Inter, sans-serif',
                            width: orientation === 'landscape' ? '1123px' : '794px',
                            height: orientation === 'landscape' ? '794px' : '1123px',
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Loading Overlay */}
                        {holidaysLoading && (
                            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-50 print:hidden">
                                <div className="bg-slate-900/90 text-white px-5 py-3 rounded-xl border border-slate-700/80 shadow-2xl flex items-center gap-3 animate-fade-in">
                                    <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-sm font-semibold tracking-wider uppercase">Loading holidays...</span>
                                </div>
                            </div>
                        )}
                        
                        {/* Aesthetic decorations */}
                        {activeTemplate.decorations === 'floral' && (
                            <>
                                <div className="absolute top-0 left-0 w-28 h-28 pointer-events-none opacity-80 rotate-0">
                                    <svg viewBox="0 0 100 100" fill={themeColor}>
                                        <path d="M0,0 Q30,10 40,40 Q10,30 0,0 M0,0 C10,40 40,60 50,50 C40,40 20,10 0,0 M20,40 Q40,60 50,80 Q30,60 20,40" opacity="0.3" />
                                        <circle cx="20" cy="20" r="8" fill={themeColor} opacity="0.6" />
                                        <circle cx="35" cy="15" r="4" fill={themeColor} opacity="0.4" />
                                        <circle cx="10" cy="35" r="6" fill={themeColor} opacity="0.5" />
                                    </svg>
                                </div>
                                <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-80 -rotate-90">
                                    <svg viewBox="0 0 100 100" fill={themeColor}>
                                        <path d="M0,0 Q30,10 40,40 Q10,30 0,0 M0,0 C10,40 40,60 50,50 C40,40 20,10 0,0 M20,40 Q40,60 50,80 Q30,60 20,40" opacity="0.3" />
                                        <circle cx="20" cy="20" r="8" fill={themeColor} opacity="0.6" />
                                        <circle cx="35" cy="15" r="4" fill={themeColor} opacity="0.4" />
                                        <circle cx="10" cy="35" r="6" fill={themeColor} opacity="0.5" />
                                    </svg>
                                </div>
                                <div className="absolute bottom-0 left-0 w-28 h-28 pointer-events-none opacity-80 rotate-90">
                                    <svg viewBox="0 0 100 100" fill={themeColor}>
                                        <path d="M0,0 Q30,10 40,40 Q10,30 0,0 M0,0 C10,40 40,60 50,50 C40,40 20,10 0,0 M20,40 Q40,60 50,80 Q30,60 20,40" opacity="0.3" />
                                        <circle cx="20" cy="20" r="8" fill={themeColor} opacity="0.6" />
                                        <circle cx="35" cy="15" r="4" fill={themeColor} opacity="0.4" />
                                        <circle cx="10" cy="35" r="6" fill={themeColor} opacity="0.5" />
                                    </svg>
                                </div>
                                <div className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none opacity-80 rotate-180">
                                    <svg viewBox="0 0 100 100" fill={themeColor}>
                                        <path d="M0,0 Q30,10 40,40 Q10,30 0,0 M0,0 C10,40 40,60 50,50 C40,40 20,10 0,0 M20,40 Q40,60 50,80 Q30,60 20,40" opacity="0.3" />
                                        <circle cx="20" cy="20" r="8" fill={themeColor} opacity="0.6" />
                                        <circle cx="35" cy="15" r="4" fill={themeColor} opacity="0.4" />
                                        <circle cx="10" cy="35" r="6" fill={themeColor} opacity="0.5" />
                                    </svg>
                                </div>
                            </>
                        )}

                        {/* Paper Calendar Header */}
                        <div className={`flex items-center justify-between mb-2 pb-2 border-b ${ template === 'dark' ? 'border-slate-700' : 'border-slate-200' }`}>
                            <div className="flex items-center gap-4">
                                {logoImage ? (
                                    <img src={logoImage} alt="logo" className="h-10 max-w-[120px] object-contain rounded animate-fade-in" />
                                ) : (
                                    <span className="text-3xl text-gradient">🗓️</span>
                                )}
                                <div>
                                    <h1 className="text-2xl font-black uppercase tracking-wider text-slate-800" style={{ color: template === 'dark' ? '#f8fafc' : '#1e293b' }}>
                                        {customTitle || `${year} Public Holidays`}
                                    </h1>
                                    <p className="text-sm font-semibold tracking-wider text-slate-500 flex items-center gap-1.5 flex-wrap">
                                        <span>{country ? country.name : 'Selected Country'} ({selectedCountryCode})</span>
                                        <span>•</span>
                                        <span>{year}</span>
                                        {holidays && holidays.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <span 
                                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full select-none"
                                                    style={{ 
                                                        backgroundColor: template === 'dark' ? 'rgba(16, 185, 129, 0.2)' : `${themeColor}15`, 
                                                        color: template === 'dark' ? '#10b981' : themeColor 
                                                    }}
                                                >
                                                    {holidays.length} Holidays
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {viewMode === 'month' && (
                                <div 
                                    className="flex items-center gap-3 text-3xl font-black uppercase px-4 py-2 rounded-lg text-white print:bg-transparent print:text-black print:border print:border-black select-none"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    <button 
                                        type="button"
                                        onClick={() => setCurrentMonth(m => (m - 1 + 12) % 12)}
                                        className="hover:scale-110 active:scale-95 transition-transform px-2 select-none print:hidden cursor-pointer"
                                        title="Previous Month"
                                    >
                                        ◀
                                    </button>
                                    <span className="min-w-[150px] text-center text-xl sm:text-2xl md:text-3xl leading-none">
                                        {new Date(parseInt(year), currentMonth, 1).toLocaleString('default', { month: 'long' })}
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => setCurrentMonth(m => (m + 1) % 12)}
                                        className="hover:scale-110 active:scale-95 transition-transform px-2 select-none print:hidden cursor-pointer"
                                        title="Next Month"
                                    >
                                        ▶
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Calendar Body */}
                        {viewMode === 'month' ? (
                            <CalendarMonthGrid 
                                year={year}
                                currentMonth={currentMonth}
                                days={getMonthDays(parseInt(year), currentMonth)}
                                getHolidaysForDate={getHolidaysForDate}
                                getPersonalEventsForDate={getPersonalEventsForDate}
                                showWeekends={showWeekends}
                                template={template}
                                themeColor={themeColor}
                                weekStart={weekStart}
                                holidaysLoading={holidaysLoading}
                            />
                        ) : (
                            <CalendarYearGrid 
                                year={year}
                                getMonthDays={getMonthDays}
                                getHolidaysForDate={getHolidaysForDate}
                                getPersonalEventsForDate={getPersonalEventsForDate}
                                showWeekends={showWeekends}
                                template={template}
                                themeColor={themeColor}
                                orientation={orientation}
                                weekStart={weekStart}
                            />
                        )}

                        {/* Paper Calendar Footer */}
                        <div className={`mt-1 pt-1 border-t ${ template === 'dark' ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between text-[9px]`}>
                            <span className="italic text-slate-400 truncate max-w-[60%]">
                                {notes || 'Notes & Planning'}
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="font-bold print:text-black" style={{ color: template === 'dark' ? '#f1f5f9' : '#475569' }}>
                                    PublicHolidayFinder
                                </span>
                                <span className="text-slate-400 italic hidden sm:inline">
                                    CC BY 4.0
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
