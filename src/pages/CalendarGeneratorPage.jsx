import React, { useRef } from 'react';
import SEO from '../components/SEO';
import { handleExportPDF, handleExportPNG, handleExportICS } from '../lib/exportUtils';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import CalendarActionBar from '../components/calendar/CalendarActionBar';
import CalendarWorkspace from '../components/calendar/CalendarWorkspace';
import CalendarErrorBoundary from '../components/calendar/CalendarErrorBoundary';
import { CalendarProvider, useCalendar } from '../context/CalendarContext';

function CalendarGeneratorContent() {
    const calendarRef = useRef(null);
    const {
        orientation, paperSize, template, selectedCountryCode, year,
        setExportingType, showToast, holidays, personalEvents,
        currentMonth, setIsMobileOpen,
        toasts
    } = useCalendar();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
            <CalendarSidebar />

            <main className="flex-grow bg-slate-950 flex flex-col overflow-hidden relative">
                <CalendarActionBar
                    handleExportPDF={() => handleExportPDF({ calendarRef, orientation, paperSize, template, selectedCountryCode, year, setExportingType, showToast })}
                    handleExportPNG={() => handleExportPNG({ calendarRef, template, selectedCountryCode, year, setExportingType, showToast })}
                    handleExportICS={(exportScope) => handleExportICS({ holidays, personalEvents, year, selectedCountryCode, showToast, exportScope, currentMonth })}
                />

                {/* Toast notifications */}
                <div className="fixed top-20 right-8 z-50 flex flex-col gap-2 pointer-events-none">
                    {toasts.map((t) => (
                        <div key={t.id} className="pointer-events-auto bg-slate-900 border border-slate-700 text-emerald-400 text-sm font-semibold rounded-lg px-4 py-3 shadow-2xl flex items-center gap-2 animate-slide-up">
                            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            {t.message}
                        </div>
                    ))}
                </div>

                <CalendarErrorBoundary>
                    <CalendarWorkspace calendarRef={calendarRef} />
                </CalendarErrorBoundary>

                {/* Mobile FAB */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed bottom-6 right-6 z-30 md:hidden bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-5 rounded-full shadow-2xl flex items-center gap-2 border border-primary-500/20 active:scale-95 transition-transform"
                >
                    <span>⚙️</span> Customize
                </button>
            </main>
        </div>
    );
}

export default function CalendarGeneratorPage() {
    return (
        <CalendarProvider>
            <SEO
                title="Printable Holiday Calendar Generator"
                description="Generate beautiful, high-quality, printable holiday calendars for school, office, travel planning, or business. Instant PDFs and PNG exports."
                keywords="holiday calendar generator, print calendar, printable public holidays, customize calendar, download calendar pdf"
            />
            <CalendarGeneratorContent />
        </CalendarProvider>
    );
}
