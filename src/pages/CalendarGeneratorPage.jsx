import React, { useRef, useEffect } from 'react';
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

    // How to Generate a Calendar — Guide State (Local)
    const [guideVisible, setGuideVisible] = React.useState(() => {
        try { return localStorage.getItem('phf_guideHidden') !== '1'; } catch { return true; }
    });

    const handleDismissGuide = () => {
        setGuideVisible(false);
        try { localStorage.setItem('phf_guideHidden', '1'); } catch (e) { /* ignore */ }
    };

    const handleShowGuide = () => {
        setGuideVisible(true);
        try { localStorage.removeItem('phf_guideHidden'); } catch (e) { /* ignore */ }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
            <CalendarSidebar />
            <main className="flex-grow bg-slate-950 flex flex-col overflow-hidden relative">
                <CalendarActionBar 
                    handleExportPDF={() => handleExportPDF({ calendarRef, orientation, paperSize, template, selectedCountryCode, year, setExportingType, showToast })}
                    handleExportPNG={() => handleExportPNG({ calendarRef, template, selectedCountryCode, year, setExportingType, showToast })}
                    handleExportICS={(exportScope) => handleExportICS({ holidays, personalEvents, year, selectedCountryCode, showToast, exportScope, currentMonth })}
                />

                {guideVisible ? (
                    <div className="mx-4 mt-3 bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 print:hidden animate-slide-up shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <span className="text-lg">📋</span> How to Generate a Calendar
                            </h3>
                            <button
                                onClick={handleDismissGuide}
                                className="text-slate-400 hover:text-white text-xs font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-slate-700"
                                title="Dismiss guide"
                            >
                                <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>Dismiss
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                                { step: '1', icon: '⚙️', title: 'Config',    desc: 'Select country & year',       color: 'from-blue-600 to-sky-500' },
                                { step: '2', icon: '🎨', title: 'Template',  desc: 'Choose a design style',       color: 'from-pink-600 to-rose-500' },
                                { step: '3', icon: '🖌️', title: 'Style',     desc: 'Customize colors & fonts',    color: 'from-amber-500 to-orange-500' },
                                { step: '4', icon: '📅', title: 'Events',    desc: 'Manage holidays & events',    color: 'from-violet-600 to-purple-500' },
                                { step: '5', icon: '📥', title: 'Export',    desc: 'PDF, PNG, ICS or Print',      color: 'from-emerald-600 to-teal-500' },
                            ].map((item) => (
                                <div key={item.step} className="flex flex-col items-center text-center gap-1.5 bg-slate-900/60 rounded-xl p-3 border border-slate-700/60 hover:border-slate-500/80 transition-colors">
                                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${item.color} text-white text-xs font-black flex items-center justify-center shadow-md`}>
                                        {item.step}
                                    </div>
                                    <div className="text-2xl">{item.icon}</div>
                                    <div className="text-xs font-bold text-slate-200 leading-tight">{item.title}</div>
                                    <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-3 text-center">
                            💡 Use the sidebar on the left to configure each setting, then export from the toolbar above.
                        </p>
                    </div>
                ) : (
                    <div className="flex justify-end px-4 pt-2 print:hidden">
                        <button
                            onClick={handleShowGuide}
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                            title="Show how-to guide"
                        >
                            <span>📋</span> How to generate a calendar?
                        </button>
                    </div>
                )}

                <div className="fixed top-20 right-8 z-50 flex flex-col gap-2 pointer-events-none">
                    {toasts.map((t) => (
                        <div key={t.id} className="pointer-events-auto bg-slate-900 border border-slate-700 text-emerald-400 text-sm font-semibold rounded-lg px-4 py-3 shadow-2xl flex items-center gap-2 animate-slide-up">
                            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> {t.message}
                        </div>
                    ))}
                </div>

                <CalendarErrorBoundary>
                    <CalendarWorkspace calendarRef={calendarRef} />
                </CalendarErrorBoundary>

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
